import debounce from '/lib/debounce.js'
import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js'
import mousecase from '/lib/mousecase.js'
import { Book } from '/types'
import '/components/circle-fit-container/index.js'
import '/components/image/index.js'

const LOADDELAY = 500

@customElement('spout-book')
export class SpoutBook extends LitElement {
  @property({ type: Object })
  data: Book = {
    cover: {
      srcset: '',
      aspectRatio: 1 / Math.sqrt(2),
      blurhash: {
        width: 32,
        height: 32,
        hash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
      },
    },
    title: 'An Obscure & Overlong Book',
    subtitle: 'You\'ve Probably never heard of it',
    author: 'E. Plumbus',
    brief: 'You can also compose templates to create more complex templates. When a binding in the text content of a template returns a TemplateResult, the TemplateResult is interpolated in place.',
    price: 300,
    discount: 12,
    size: { width: 11, height: 16, pages: 98 },
    tags: [
      'illustrated',
      'annotated',
      'translated',
    ],
    blurb: `
<p>However, the path was not desolate for Mark Twain. It was The Garden of Eden!</p>
<p>What was it between Adam and Eve? Love, as we know. But was it like the love as we know it NOW? Or was it different back then, in that primordial universe?</p>
<p>Two highly imaginative tales by Mark Twain, dealing with the human psychology of love—the simplest pleasure—the strongest compassion—the richest benevlolence—and yet the toughest emotion to stand by—are brought together under this title: Chronicle of Eden.</p>
    `,
    gallery: [
      {
        srcset: '',
        aspectRatio: 1.618,
      },
      {
        srcset: '',
        aspectRatio: 1,
      },
      {
        srcset: '',
        aspectRatio: 0.5,
      },
      {
        srcset: '',
        aspectRatio: 1.141,
      },
      {
        srcset: '',
        aspectRatio: 0.75,
      },
    ],
  }

  @property({ type: Object })
  hide = {
    cover: false,
    titling: false,
    store: false,
    blurb: false,
    gallery: false,
  }

  @property({ type: Boolean })
  coverSmall = false

  #ready = false
  #retries = 0

  render() {
    return html`
      <link rel="stylesheet" href="/components/book/index.css" />

      <main style="display: none; opacity: 0;">
        ${this.hide.cover ? '' : html`
          <section class="cover ${this.coverSmall ? 'small' : ''}">
            <spout-circle-fit-container .aspectRatio=${this.data.cover.aspectRatio} .randomX=${this.coverSmall} .randomR=${this.coverSmall}>
              <spout-image .data=${this.data.cover}></spout-image>
            </spout-circle-fit-container>
          </section>
        `}

        <section class="listing">
          ${this.hide.titling ? '' : html`
            <section class="titling">
              <div class="title">${this.data.title}</div>
              <div class="subtitle">${this.data.subtitle}</div>
              <div class="author">${this.data.author}</div>
              <div class="brief">${this.data.brief}</div>
            </section>
          `}

          ${this.hide.store ? '' : html`
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

        ${this.hide.blurb ? '' : html`<section class="blurb">${unsafeHTML(this.data.blurb)}</section>`}

        ${this.hide.gallery ? '' : html`
          <section class="gallery">
            <main>
              ${this.data.gallery.map(({ aspectRatio }) => html`
                <spout-circle-fit-container fitWidth ignoreWidth .aspectRatio=${aspectRatio}></spout-circle-fit-container>
              `)}
            </main>
          </section>
        `}
      </main>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    self.addEventListener('resize', debounce(200, () => this.resize()))
  }

  firstUpdated() {
    const $stylesheet = (this.shadowRoot as ShadowRoot).querySelector('link') as HTMLElement
    $stylesheet.addEventListener('load', () => {
      this.#ready = true

      // render main
      const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
      $main.style.display = ''
      self.requestAnimationFrame(() => $main.style.opacity = '')

      // center gallery
      const $gallery = $main.querySelector('.gallery > main') as HTMLElement
      mousecase($gallery).init()

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

  resize() {
    if (this.#ready && this.#retries < 100) return

    const $gallery = (this.shadowRoot as ShadowRoot).querySelector('.gallery > main') as HTMLElement
    const $images = Array.from((this.shadowRoot as ShadowRoot).querySelectorAll('.gallery > main > *'))

    // wait if the first gallery element hasn't been redrawn yet, since we need those dimensions
    if (!$images[0].clientWidth) {
      this.#retries++
      requestAnimationFrame(() => this.resize())
      return
    }

    $gallery.style.paddingLeft = $images[0].clientWidth / $gallery.clientWidth <= 0.8
      ? `${($gallery.clientWidth - $images[0].clientWidth) / 2} px`
      : ''

    this.#retries = 0
  }
}
