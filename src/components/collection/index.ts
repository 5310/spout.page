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

    const book = (id: string, i: number) =>
      until(
        fetch(`/content/books/${id}/index.json`)
          .then(response => response.json())
          .then(data => html`
            <spout-book
              class="cover"
              style="
                grid-row-start: ${2 + i};
                bottom: ${self.innerWidth / self.innerHeight > 1 ? `calc(-33vmin - 5% * ${i + 1})` : `calc(-2.5% * ${i + 1})`};
                z-index: ${100 - i};
              "
              summary
              .data=${data}
              .hide="${{ listing: true }}"
              @click="${() => ((this.shadowRoot as ShadowRoot).querySelector(`.books :nth-child(${(i + 1) * 2})`) as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })}"
              ></spout-book>
            <spout-book
              class="listing"
              style="
                grid-row-start: ${2 + i};
                z-index: ${100 - i};
              "
              summary
              .data=${data}
              .hide="${{ cover: true }}"></spout-book>
          `),
        '',
      )

    return html`
      <link rel="stylesheet" href="/components/collection/index.css" />

      <main style="display: none; opacity: 0;">
          <section class="titling">
            <div class="blurb">${unsafeHTML(this.data.blurb)}</div>
            <div class="title">${this.data.title}</div>
          </section>

          <section class="books">
            ${this.data.books.map((id, i) => book(id, i))}
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
