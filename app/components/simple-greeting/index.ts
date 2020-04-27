import { LitElement, html, css, property, customElement } from '/web_modules/lit-element.js'

@customElement('spout-simple-greeting')
export class SpoutSimpleGreeting extends LitElement {
  @property()
  name = 'World'

  render() {
    return html`
      <link rel="stylesheet" href="/app/components/simple-greeting/index.css" />
      <p>Hullo, ${this.name}!!</p>
    `
  }
}
