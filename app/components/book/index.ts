import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js'
import { Book } from '../../types'
import '/app/components/circle-fit-container/index.js'

const LOADDELAY = 500

@customElement('spout-book')
export class SpoutBook extends LitElement {
  @property({ type: Object })
  data /*: Book*/ = {
    cover: {
      aspectRatio: 1 / Math.sqrt(2),
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
    `
  }

  @property({ type: Boolean })
  cover: boolean = false

  @property({ type: Boolean })
  listing: boolean = false

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/book/index.css" />

      <main class="${this.cover || this.listing ? 'partial' : ''}" style="opacity: 0;">
        <section class="cover">
          <spout-circle-fit-container .aspectRatio=${this.data.cover.aspectRatio}></spout-circle-fit-container>
        </section>

        <section class="listing">
          <section class="titling">
            <div class="title">${this.data.title}</div>
            <div class="subtitle">${this.data.subtitle}</div>
            <div class="author">${this.data.author}</div>
            <div class="brief">${this.data.brief}</div>
          </section>
          <section class="store">
            <div class="cost">${this.data.price * (100 - (this.data.discount ?? 0)) / 100}₹</div>
            <ul class="details">
              <li class="type strong">${this.data.size.pages} pages</li>
              <li class="type strong">${this.data.size.width}"×${this.data.size.height}"</li>
              ${this.data.tags.map(tag => html`<li>${tag}</li>`)}
            </ul>
          </section>
        </section>

        <section class='blurb'>${unsafeHTML(this.data.blurb)}</section>

        <section class='gallery'></section>
      </main>
    `
  }

  firstUpdated() {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    self.setTimeout(() => {
      requestAnimationFrame(() => $main.style.opacity = '1')
    }, LOADDELAY)
  }
}
