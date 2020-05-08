import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'
import { unsafeHTML } from '/web_modules/lit-html/directives/unsafe-html.js'
import { until } from '/web_modules/lit-html/directives/until.js'
import { ID, Collection } from '/types'
import '/components/book/index.js'

@customElement('spout-collection')
export default class SpoutCollection extends LitElement {
  @property({ type: Object })
  data: Collection | undefined

  @property({ type: Boolean })
  summary = false

  render() {
    if (!this.data) return

    const book = (id: ID) => until(
      fetch(`/content/books/${id}/index.json`)
        .then(response => response.json())
        .then(data => html`<spout-book class="book" .data=${data} summary></spout-book>`),
      html`<div class="book"></div>`,
    )

    return html`
      <link rel="stylesheet" href="/components/collection/index.css" />

      <main style="display: none; opacity: 0;">
          <section class="titling">
            <div class="blurb">${unsafeHTML(this.data.blurb)}</div>
            <div class="title">${this.data.title}</div>
          </section>

          <section class="books">
            ${this.data.books.map(id => book(id))}
          </section>
      </main>
    `
  }

  firstUpdated() {
    const $stylesheet = (this.shadowRoot as ShadowRoot).querySelector('link') as HTMLElement
    $stylesheet.addEventListener('load', () => {
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
    })
  }
}
