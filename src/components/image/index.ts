import log from '/lib/log.js'
import debounce from '/lib/debounce.js'
import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import { decode } from '/web_modules/blurhash.js'
import { Image } from '/types'

@customElement('spout-image')
export default class SpoutImage extends LitElement {
  @property({ type: Object })
  data: Image = {
    srcset: '',
    aspectRatio: 1 / 1,
    blurhash: {
      width: 32,
      height: 32,
      hash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    },
  }

  #ready = false
  #retries = 0
  #blurhash: Uint8ClampedArray = new Uint8ClampedArray()

  render() {
    return html`
      <link rel="stylesheet" href="/components/image/index.css" />
      <main style="display: none; opacity: 0;">
        <img alt="${this.data.alt ?? ''}" srcset="${this.data.srcset}" style="opacity: 0;" width=0 height=0></img>
        <canvas width=0 height=0></canvas>
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

    const $img = (this.shadowRoot as ShadowRoot).querySelector('img') as HTMLImageElement
    $img.addEventListener('load', () => {
      $img.style.opacity = ''
    })
  }

  updated(changedProperties: any) {
    this.resize()
  }

  resize() {
    if (!this.#ready && this.#retries < 100) return

    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $img = (this.shadowRoot as ShadowRoot).querySelector('img') as HTMLImageElement
    const $canvas = (this.shadowRoot as ShadowRoot).querySelector('canvas') as HTMLCanvasElement

    $img.style.display = 'none'

    const mainScrollWidth = $main.scrollWidth
    const mainScrollHeight = $main.scrollHeight

    const width = mainScrollWidth ? mainScrollWidth : mainScrollHeight * this.data.aspectRatio
    const height = mainScrollWidth ? mainScrollWidth / this.data.aspectRatio : mainScrollHeight

    // DEBUG:
    log('image', 'resize', {
      mainScrollWidth,
      mainScrollHeight,
      width,
      height,
    })

    // wait if the main element hasn't been redrawn yet, since we need those dimensions
    if (!width || !height) {
      this.#retries++
      requestAnimationFrame(() => this.resize())
      return
    }

    $img.width = width
    $img.height = height
    $img.style.display = ''

    if (this.data.blurhash) {

      const blurhash = this.data.blurhash as { width: number, height: number, hash: string }

      $canvas.width = blurhash.width
      $canvas.height = blurhash.height

      this.#blurhash = this.#blurhash.length ? this.#blurhash : decode(blurhash.hash, blurhash.width, blurhash.height)

      const ctx = $canvas.getContext('2d') as CanvasRenderingContext2D
      const imageData = ctx.createImageData(blurhash.width, blurhash.height)
      imageData.data.set(this.#blurhash)
      ctx.putImageData(imageData, 0, 0)
    }

    this.#retries = 0
  }
}
