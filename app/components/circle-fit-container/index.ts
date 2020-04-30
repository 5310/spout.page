import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'

@customElement('spout-circle-fit-container')
export class SpoutCircleFitContainer extends LitElement {
  @property({ type: Number })
  aspectRatio = 1 / 1

  @property({ type: Number })
  diameter: number = 0

  @property({ type: Boolean })
  fit: boolean = false

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/circle-fit-container/index.css" />
      <main>
        <div class='circle'></div>
        <slot></slot>
      </main>
    `
  }

  updated() {
    this.resize()
  }

  resize() {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $circle = (this.shadowRoot as ShadowRoot).querySelector('.circle') as HTMLElement
    const $slot = (this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLElement

    $circle.style.display = 'none'
    $slot.style.display = 'none'

    $main.style.width = ''
    $main.style.height = ''

    const diameter = this.diameter || Math.min($main.scrollWidth || Infinity, $main.scrollHeight || Infinity, window.innerHeight)
    const angle = Math.atan(this.aspectRatio <= 0 ? 1 / 1 : this.aspectRatio)

    $circle.style.width = $circle.style.height = `${Math.floor(diameter)}px`

    $slot.style.width = `${Math.floor(diameter * Math.sin(angle))}px`
    $slot.style.height = `${Math.floor(diameter * Math.cos(angle))}px`

    $circle.style.margin = 'initial'
    if (this.fit) {
      $circle.style.margin = '-100vmax'
      $main.style.width = $slot.style.width
      $main.style.height = $slot.style.height
    }

    $circle.style.display = 'initial'
    $slot.style.display = 'initial'
  }
}
