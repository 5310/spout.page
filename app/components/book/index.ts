import { LitElement, html, css, property, customElement } from '/web_modules/lit-element.js'
import { Book } from '../../types'

@customElement('spout-book')
export class SpoutBook extends LitElement {
  @property({ type: Object })
  data /*: Book*/ = {
    title: 'An Obscure Book',
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
  }

  @property({ type: Boolean })
  cover: boolean = false

  @property({ type: Boolean })
  listing: boolean = false

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/book/index.css" />

      <main class="${this.cover || this.listing ? 'partial' : ''}">
        <section class="cover">
          <div></div>
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
              <li>${this.data.size.pages} pages</li>
              <li>${this.data.size.width}"×${this.data.size.height}"</li>
              ${this.data.tags.map(tag => html`<li>${tag}</li>`)}
            </ul>
          </section>
        </section>

        <section class='blurb'></section>

        <section class='gallery'></section>
      </main>
    `
  }
}
