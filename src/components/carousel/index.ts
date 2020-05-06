import log from '/lib/log.js'
import debounce from '/lib/debounce.js'
import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import mousecase from '/lib/mousecase.js'

@customElement('spout-carousel')
export class SpoutImage extends LitElement {
  #ready = false
  #retries = 0

  render() {
    return html`
      <link rel="stylesheet" href="/components/carousel/index.css" />
      <main style="display: none; opacity: 0;">
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
      mousecase($main).init()
      this.resize()
    })
  }

  resize() {
    if (!this.#ready || this.#retries >= 100) return

    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $contents = Array.from((this.shadowRoot as ShadowRoot).querySelectorAll('main > slot > *')) // FIXME: not selecting right

    // wait if the first gallery element hasn't been redrawn yet, since we need those dimensions
    if (!$contents[0].clientWidth) {
      this.#retries++
      requestAnimationFrame(() => this.resize())
      return
    }

    $main.style.paddingLeft = $contents[0].clientWidth / $main.clientWidth <= 0.8
      ? `${($main.clientWidth - $contents[0].clientWidth) / 2}px`
      : ''

    this.#retries = 0
  }
}
