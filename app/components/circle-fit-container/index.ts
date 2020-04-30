import { LitElement, html, property, customElement } from '/web_modules/lit-element.js'

@customElement('spout-circle-fit-container')
export class SpoutCircleFitContainer extends LitElement {
  @property({ type: Number })
  aspectRatio = 1 / 1

  @property({ type: Number })
  diameter: number = 0

  @property({ type: Boolean })
  fit: boolean = false

  @property({ type: Number })
  offsetX: number = 0

  @property({ type: Number })
  offsetY: number = 0

  @property({ type: Number })
  offsetR: number = 0

  @property({ type: Boolean })
  randomX: boolean = true

  @property({ type: Boolean })
  randomY: boolean = true

  @property({ type: Boolean })
  randomR: boolean = true

  #mainWidth = ''
  #mainHeight = ''

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/circle-fit-container/index.css" />
      <main>
        <div class='circle'></div>
        <slot></slot>
      </main>
    `
  }

  updated(changedProperties: any) {
    this.resize()
  }

  resize() {
    const $main = (this.shadowRoot as ShadowRoot).querySelector('main') as HTMLElement
    const $circle = (this.shadowRoot as ShadowRoot).querySelector('.circle') as HTMLElement
    const $slot = (this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLElement

    $circle.style.display = 'none'
    $slot.style.display = 'none'
    $circle.style.transform = 'initial'
    $slot.style.transform = 'initial'

    $main.style.width = ''
    $main.style.height = ''

    const diameter = this.diameter || Math.min($main.scrollWidth || Infinity, $main.scrollHeight || Infinity, window.innerHeight)
    const angle = Math.atan(this.aspectRatio <= 0 ? 1 / 1 : this.aspectRatio)

    $circle.style.width = $circle.style.height = `${Math.floor(diameter)}px`

    const width = Math.floor(diameter * Math.sin(angle))
    const height = Math.floor(diameter * Math.cos(angle))
    $slot.style.width = `${width}px`
    $slot.style.height = `${height}px`

    $circle.style.margin = 'initial'
    if (this.fit) {
      $circle.style.margin = '-100vmax'
      $main.style.width = $slot.style.width
      $main.style.height = $slot.style.height
    }

    $circle.style.display = 'initial'
    $slot.style.display = 'initial'

    const offsetX = this.offsetX || (this.randomX && this.fit ? 0 : (Math.random() > 0.5 ? +1 : -1) * Math.random() * ($main.scrollWidth - diameter) / 2)
    const offsetY = this.offsetY || (this.randomX && this.fit ? 0 : (Math.random() > 0.5 ? +1 : -1) * Math.random() * ($main.scrollHeight - diameter) / 2)
    const offsetR = this.offsetR || (this.randomR ? (Math.floor(Math.random() * 3) + (Math.random() > 0.5 ? +1 : -1) * Math.random() ** 2) * 30 : 0)
    $circle.style.transform = `translate(${offsetX}px)`
    $slot.style.transform = `translate(${offsetX}px) rotate(${offsetR}deg)`
  }
}
