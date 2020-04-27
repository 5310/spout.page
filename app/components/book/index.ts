import { LitElement, html, css, property, customElement } from '/web_modules/lit-element.js'
import { Book } from '../../types'

@customElement('spout-book')
export class SpoutBook extends LitElement {
  @property({ type: Object })
  data /*: Book*/ = {}

  @property({ type: Boolean })
  cover: boolean = false

  @property({ type: Boolean })
  listing: boolean = false

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/book/index.css" />
      <main class="${this.cover || this.listing ? 'partial' : ''}">
        <section class='cover'>
          <div>dummy content</div>
        </section>
        <section class='listing'>
          <section class='titling'>
            <ul>
              <li>title</li>
              <li>subtitle</li>
              <li>author</li>
            </ul>
          </section>
          <section class='store'></section>
        </section>
        <section class='blurb'></section>
        <section class='gallery'></section>
      </main>
    `
  }
}
