import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'

@customElement('spout-circle-fit-container')
export class SpoutCircleFitContainer extends LitElement {
  @property({ type: Number })
  aspectRatio = 1 / 1

  @property({ type: Number })
  diameter: number = 0

  @property({ type: Boolean })
  fit: boolean = false

  @property({ type: Number })
  offsetX: number = 0

  @property({ type: Number })
  offsetY: number = 0

  @property({ type: Number })
  offsetR: number = 0

  @property({ type: Boolean })
  randomX: boolean = false

  @property({ type: Boolean })
  randomY: boolean = false

  @property({ type: Boolean })
  randomR: boolean = false

  #diameter: number = 0
  #offsetX: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #offsetY: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #offsetR: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/circle-fit-container/index.css" />
      <main>
        <div class='circle'></div>
        <slot></slot>
      </main>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('resize', this.resize.bind(this))
  }

  // firstUpdated(changedProperties: any) {
  //   requestAnimationFrame(() => this.resize())
  // }

  updated(changedProperties: any) {
    this.resize()
  }

  resize() {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $circle = (this.shadowRoot as ShadowRoot).querySelector('.circle') as HTMLElement
    const $slot = (this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLElement

    $circle.style.display = 'none'
    $slot.style.display = 'none'
    $circle.style.transform = 'initial'
    $slot.style.transform = 'initial'

    $main.style.width = ''
    $main.style.height = ''

    const mainScrollWidth = $main.scrollWidth || Infinity
    const mainScrollHeight = $main.scrollHeight || Infinity

    this.#diameter = this.diameter || Math.min(mainScrollWidth, mainScrollHeight, window.innerHeight)

    const angle = Math.atan(this.aspectRatio <= 0 ? 1 / 1 : this.aspectRatio)

    $circle.style.width = $circle.style.height = `${Math.floor(this.#diameter)}px`

    const width = Math.floor(this.#diameter * Math.sin(angle))
    const height = Math.floor(this.#diameter * Math.cos(angle))

    $slot.style.width = `${width}px`
    $slot.style.height = `${height}px`

    $circle.style.margin = 'initial'
    if (this.fit) {
      $circle.style.margin = '-100vmax'
      $main.style.width = $slot.style.width
      $main.style.height = $slot.style.height
    }

    $circle.style.display = 'initial'
    $slot.style.display = 'initial'

    this.offset()
  }

  offset() {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $circle = (this.shadowRoot as ShadowRoot).querySelector('.circle') as HTMLElement
    const $slot = (this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLElement

    const mainScrollWidth = $main.scrollWidth
    const mainScrollHeight = $main.scrollHeight

    // wait if the main element hasn't been redrawn yet, since we need those dimensions
    if (!mainScrollWidth || !mainScrollHeight) {
      requestAnimationFrame(() => this.offset())
      return
    }

    const translateX = this.randomX && !this.fit
      ? (this.offsetX || this.#offsetX) * (mainScrollWidth - this.#diameter) / 2
      : 0
    const translateY = this.randomY && !this.fit
      ? (this.offsetY || this.#offsetY) * (mainScrollHeight - this.#diameter) / 2
      : 0
    const rotate = this.randomR
      ? (this.offsetY || this.#offsetY) * 80
      : 0

    $circle.style.transform = `translate(${translateX}px, ${translateY}px)`
    $slot.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
  }
}
