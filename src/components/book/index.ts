import debounce from '/lib/debounce.js'
import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js'
import mousecase from '/lib/mousecase.js'
import { Book } from '/types'
import '/components/carousel/index.js'
import '/components/circumcircle/index.js'
// tslint:disable-next-line: no-duplicate-imports
import SpoutCircumcircle from '/components/circumcircle/index.js'
import '/components/image/index.js'

@customElement('spout-book')
export default class SpoutBook extends LitElement {
  @property({ type: Object })
  data: Book | undefined

  @property({ type: Object })
  hide = {
    cover: false,
    listing: false,
    titling: false,
    store: false,
    blurb: false,
    gallery: false,
  }

  @property({ type: Boolean })
  summary = false

  #ready = false
  #retries = 0

  render() {
    if (!this.data) return
    return html`
      <link rel="stylesheet" href="/components/book/index.css" />

      <main style="display: none; opacity: 0;" class="${this.summary ? 'summary' : ''}">
        ${this.hide.cover ? '' : html`
          <section class="cover">
            <spout-circumcircle .aspectRatio=${this.data.cover.aspectRatio} .randomX=${this.summary} .randomR=${this.summary}>
              <spout-image .data=${this.data.cover}></spout-image>
            </spout-circumcircle>
          </section>
        `}

        ${this.hide.listing ? '' : html`
          <section class="listing">
            ${this.hide.titling ? '' : html`
              <section class="titling">
                <div class="title">${this.data.title}</div>
                <div class="subtitle">${this.data.subtitle}</div>
                <div class="author">${this.data.author}</div>
                <div class="brief">${this.data.brief}</div>
              </section>
            `}

            ${this.summary || this.hide.store ? '' : html`
              <section class="store">
                <div class="cost">${this.data.price * (100 - (this.data.discount ?? 0)) / 100}₹</div>
                <ul class="details">
                  <li class="type strong">${this.data.size.pages} pages</li>
                  <li class="type strong">${this.data.size.width}"×${this.data.size.height}"</li>
                  ${this.data.tags.map(tag => html`<li>${tag}</li>`)}
                </ul>
              </section>
            `}
          </section>
        `}

        ${this.summary ? '' : html`
          ${this.hide.blurb ? '' : html`<section class="blurb">${unsafeHTML(this.data.blurb)}</section>`}

          ${this.hide.gallery ? '' : html`
            <section class="gallery">
              <spout-carousel>
                ${this.data.gallery.map(image => html`
                  <spout-circumcircle fitWidth ignoreWidth .aspectRatio=${image.aspectRatio}>
                    <spout-image .data=${image}></spout-image>
                  </spout-circumcircle>
                `)}
              </spout-carousel>
            </section>
          `}
        `}
      </main>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    self.addEventListener('resize', debounce(200, () => this.resize()))
  }

  firstUpdated() {
    if (!this.data) return
    const $stylesheet = (this.shadowRoot as ShadowRoot).querySelector('link') as HTMLElement
    $stylesheet.addEventListener('load', () => {
      this.#ready = true

      // render main
      const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
      $main.style.display = ''
      self.requestAnimationFrame(() => $main.style.opacity = '')

      // animate sections load-in
      const $sections = Array.from((this.shadowRoot as ShadowRoot).querySelectorAll('main > *')) as HTMLElement[]
      $sections.forEach(($section, i) => {
        $section.animate(
          {
            opacity: [0, 1]
          },
          {
            delay: 200 * i,
            duration: 500,
            fill: 'forwards',
            easing: 'ease-out',
          }
        )
      })

      this.resize()
    })
  }

  updated() {
    this.resize()
  }

  resize() {
    if (!this.#ready || this.#retries >= 100) return

    const $cover = (this.shadowRoot as ShadowRoot).querySelector('.cover > spout-circumcircle') as SpoutCircumcircle
    if ($cover) $cover.fitWidth = !this.summary && (self.innerWidth <= 640)

    this.#retries = 0
  }
}
