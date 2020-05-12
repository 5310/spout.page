// tslint:disable no-duplicate-imports
import debounce from '/lib/debounce.js'
import '/web_modules/router-slot.js'
import { RouterSlot, IRoutingInfo } from '/web_modules/router-slot.js'
import { LitElement, html, property, customElement, query } from '/web_modules/lit-element.js'
import '/components/book/index.js'
import SpoutBook from '/components/book/index.js'
import '/components/collection/index.js'
import SpoutCollection from '/components/collection/index.js'
import '/components/simple-greeting/index.js'
import SpoutSimpleGreeting from '/components/simple-greeting/index.js'

const RETRIESLIMIT = 100

@customElement('spout-app')
export default class SpoutApp extends LitElement {
  #ready = false
  #retries = 0

  @query('router-slot') $routerSlot!: RouterSlot

  @property({ type: String })
  title = ''

  routes = [
    {
      path: 'collections/:id',
      component: SpoutCollection,
      setup: (component: HTMLElement, info: IRoutingInfo) => {
        fetch(`/content/collections/${info.match.params.id}/index.json`)
          .then(response => response.json())
          .then(data => {
            (component as SpoutCollection).data = data
            this.title = `collection · ${data.title}`
          })
          .catch(() => {
            fetch(`/content/collections/404/index.json`)
              .then(response => response.json())
              .then(data => {
                (component as SpoutCollection).data = data
                this.title = `collection not found`
              })
          })
      },
    },
    {
      path: 'books/:id',
      component: SpoutBook,
      setup: (component: HTMLElement, info: IRoutingInfo) => {
        fetch(`/content/books/${info.match.params.id}/index.json`)
          .then(response => response.json())
          .then(data => {
            (component as SpoutBook).data = data
            this.title = `book · ${data.title}`
          })
          .catch(() => {
            fetch(`/content/books/404/index.json`)
              .then(response => response.json())
              .then(data => {
                (component as SpoutBook).data = data
                this.title = `book not found`
              })
          })
      },
    },
    {
      path: '/',
      redirectTo: 'collections/placeholder', // TODO:
    },
    {
      path: 'about',
      redirectTo: 'collections/placeholder', // TODO:
    },
    {
      path: 'collections',
      redirectTo: 'collections/placeholder', // TODO:
    },
    {
      path: 'books',
      redirectTo: 'books/placeholder', // TODO:
    },
    {
      path: '**',
      redirectTo: 'collections/placeholder', // TODO:
    },
  ]

  render() {
    self.document.title = `spout.page · ${this.title}`
    return html`
      <link rel="stylesheet" href="/components/app/index.css" />
      <header style="opacity: 0;">
        <section class="title" @click=${() => self.scrollTo({ top: 0, behavior: 'smooth' })}>${this.title}</section>
        <section class="logo"></section>
      </header>
      <main>
        <router-slot></router-slot>
      </main>
      <footer style="opacity: 0;"></footer>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    self.addEventListener('resize', debounce(200, () => this.resize()))
  }

  firstUpdated() {
    this.$routerSlot.add(this.routes)

    const $stylesheet = (this.shadowRoot as ShadowRoot).querySelector('link') as HTMLElement
    $stylesheet.addEventListener('load', () => {
      this.#ready = true

      // render main
      const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
      $main.style.display = ''
      self.requestAnimationFrame(() => $main.style.opacity = '')

      // animate sections load-in
      const $sections = Array.from((this.shadowRoot as ShadowRoot).querySelectorAll('header, footer')) as HTMLElement[]
      $sections.forEach(($section, i) => {
        $section.animate(
          {
            opacity: [0, 1]
          },
          {
            delay: 200 * i,
            duration: 200,
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
    if (!this.#ready || this.#retries >= RETRIESLIMIT) return

    this.#retries = 0
  }
}
