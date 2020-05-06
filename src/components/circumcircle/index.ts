import log from '/lib/log.js'
import debounce from '/lib/debounce.js'
import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'

const ROTATIONLIMIT = 60

@customElement('spout-circumcircle')
export class SpoutCircumcircle extends LitElement {
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

  #ready = false
  #retries = 0
  #diameter: number = 0
  #randomOffsetX: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #randomOffsetY: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()
  #randomOffsetR: number = (Math.random() > 0.5 ? +1 : -1) * Math.random()

  render() {
    return html`
      <link rel="stylesheet" href="/components/circumcircle/index.css" />
      <main style="display: none; opacity: 0;">
        <div class='circle'></div>
        <slot></slot>
      </main>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    self.addEventListener('resize', debounce(200, () => this.resize()))
  }

  firstUpdated(changedProperties: any) {
    const $stylesheet = (this.shadowRoot as ShadowRoot).querySelector('link') as HTMLElement
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    $stylesheet.addEventListener('load', () => {
      this.#ready = true
      $main.style.display = ''
      self.requestAnimationFrame(() => $main.style.opacity = '')
      this.resize()
    })
  }

  updated(changedProperties: any) {
    this.resize()
  }

  resize() {
    if (!this.#ready && this.#retries < 100) return

    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $circle = (this.shadowRoot as ShadowRoot).querySelector('.circle') as HTMLElement
    const $slot = (this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLElement

    $circle.style.display = 'none'
    $slot.style.display = 'none'
    $circle.style.transform = ''
    $slot.style.transform = ''

    $main.style.width = ''
    $main.style.height = ''

    const mainScrollWidth = $main.scrollWidth
    const mainScrollHeight = $main.scrollHeight

    // wait if the main element hasn't been redrawn yet, since we need those dimensions
    if ((!this.ignoreWidth && !mainScrollWidth) || (this.ignoreWidth && !mainScrollHeight)) {
      this.#retries++
      requestAnimationFrame(() => this.resize())
      return
    }

    this.#diameter = this.diameter || Math.min(mainScrollWidth || Infinity, mainScrollHeight)

    const angle = Math.atan(this.aspectRatio <= 0 ? 1 / 1 : this.aspectRatio)

    $circle.style.width = $circle.style.height = `${Math.floor(this.#diameter)}px`

    const width = Math.floor(this.#diameter * Math.sin(angle))
    const height = Math.floor(this.#diameter * Math.cos(angle))

    // DEBUG:
    log('circumcircle', 'resize', {
      mainScrollWidth,
      mainScrollHeight,
      diameter: this.#diameter,
      angle,
      width,
      height,
    })

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

    this.#retries = 0
  }

  offset() {
    if (!this.#ready) return

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
    log('circumcircle', 'offset', {
      mainScrollWidth,
      randomOffsetX: this.#randomOffsetX,
      translateX,
      mainScrollHeight,
      offsetY: this.offsetY,
      randomOffsetY: this.#randomOffsetY,
      translateY,
    })

    $circle.style.transform = `translate(${translateX}px, ${translateY}px)`
    $slot.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
  }
}
