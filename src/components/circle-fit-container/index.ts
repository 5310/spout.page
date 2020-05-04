import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'

const LOADDELAY = 500
const ROTATIONLIMIT = 60

@customElement('spout-circle-fit-container')
export class SpoutCircleFitContainer extends LitElement {
  @property({ type: Number })
  aspectRatio = 1 / 1

  @property({ type: Number })
  diameter: number = 0

  @property({ type: Boolean })
  fit: boolean = false

  @property({ type: Boolean })
  fitWidth: boolean = false

  @property({ type: Boolean })
  fitHeight: boolean = false

  @property({ type: Boolean })
  ignoreWidth: boolean = false

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
  #randomOffsetX: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #randomOffsetY: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #randomOffsetR: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()

  render() {
    return html`
      <link rel="stylesheet" href="/components/circle-fit-container/index.css" />
      <main style="display: none; opacity: 0;">
        <div class='circle'></div>
        <slot></slot>
      </main>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    self.addEventListener('resize', this.resize.bind(this))
  }

  firstUpdated(changedProperties: any) {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    self.setTimeout(() => {
      $main.style.display = ''
      requestAnimationFrame(() => $main.style.opacity = '1')
      this.resize()
    }, LOADDELAY)
  }

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

    const mainScrollWidth = this.ignoreWidth ? Infinity : $main.scrollWidth || Infinity
    const mainScrollHeight = $main.scrollHeight || Infinity

    this.#diameter = this.diameter || Math.min(mainScrollWidth, mainScrollHeight, self.innerHeight)

    const angle = Math.atan(this.aspectRatio <= 0 ? 1 / 1 : this.aspectRatio)

    $circle.style.width = $circle.style.height = `${Math.floor(this.#diameter)}px`

    const width = Math.floor(this.#diameter * Math.sin(angle))
    const height = Math.floor(this.#diameter * Math.cos(angle))

    // DEBUG:
    // console.log({
    //   mainScrollWidth,
    //   mainScrollHeight,
    //   diameter: this.#diameter,
    //   angle,
    //   width,
    //   height,
    // }, self.document.body.scrollWidth)

    $slot.style.width = `${width}px`
    $slot.style.height = `${height}px`

    $circle.style.marginTop = $circle.style.marginLeft = $circle.style.marginBottom = $circle.style.marginRight = 'initial'
    if (this.fit || this.fitWidth) {
      $circle.style.marginLeft = $circle.style.marginRight = '-100vmax'
      $main.style.width = $slot.style.width
    }
    if (this.fit || this.fitHeight) {
      $circle.style.marginTop = $circle.style.marginBottom = '-100vmax'
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

    const translateX = !this.fit
      ? ((this.randomX ? this.#randomOffsetX : this.offsetX) || 0) * (mainScrollWidth - this.#diameter) / 2
      : 0
    const translateY = !this.fit
      ? ((this.randomY ? this.#randomOffsetY : this.offsetY) || 0) * (mainScrollHeight - this.#diameter) / 2
      : 0
    const rotate = this.randomR
      ? (this.offsetY || this.#randomOffsetR) * ROTATIONLIMIT
      : 0

    // DEBUG:
    // console.log({
    //   mainScrollWidth,
    //   randomOffsetX: this.#randomOffsetX,
    //   translateX,
    //   mainScrollHeight,
    //   offsetY: this.offsetY,
    //   randomOffsetY: this.#randomOffsetY,
    //   translateY,
    // })

    $circle.style.transform = `translate(${translateX}px, ${translateY}px)`
    $slot.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
  }
}
