// source: https://github.com/yowainwright/mousecase
// Minimal changes.
//
// This is ported locally because the original package publishes no type annotations despite being TypeScript
// and despite claiming to in the doc, cannot accept an HTMLElement as target, only a string selector
// which will not work inside a web-component

interface MousecasePropArguments {
  cssClass?: string
  rule?: boolean
}

interface MousecaseProps {
  activeClass: string
  cssClass: string
  el: HTMLElement
  rule: boolean
}

interface MousecaseState {
  isDown: boolean
  startx: number
  scrollLeft: number
  isOn: boolean
}

type MousecaseThis = any

interface MousecaseResult {
  props: MousecaseProps
  state: MousecaseState
  canUseMousecase: (target: HTMLElement, rule: boolean) => boolean
  mouseMove: (e: MouseEvent) => MousecaseThis
  mouseDown: (e: MouseEvent) => MousecaseThis
  mouseNotDown: () => MousecaseThis
  manageState: () => MousecaseThis
  init: () => void
  off: () => MousecaseThis
  on: () => MousecaseThis
}

const mousecase = (
  target: HTMLElement,
  {
    cssClass = 'js-mousecase',
    rule = true,
  }: MousecasePropArguments = {}
): MousecaseResult => ({
  props: {
    el: target,
    cssClass,
    rule,
    activeClass: `${cssClass}--is-active`,
  },
  state: {
    isDown: false,
    startx: 0,
    scrollLeft: 0,
    isOn: false,
  },
  canUseMousecase(target_: HTMLElement, rule_: boolean): boolean {
    if (
      !target_ ||
      rule_ === false
    ) return false
    return true
  },
  mouseMove(e: MouseEvent) {
    if (!this.state.isDown) return
    e.preventDefault()
    const { el } = this.props
    const initial = e.pageX - el.offsetLeft
    const distance = (initial - this.state.startx) * 3
    el.scrollLeft = this.state.scrollLeft - distance
    return this
  },
  mouseDown(e: MouseEvent) {
    const { activeClass, el } = this.props
    this.state.isDown = true
    el.classList.add(activeClass)
    this.state.startx = e.pageX - el.offsetLeft
    this.state.scrollLeft = el.scrollLeft
    return this
  },
  mouseNotDown() {
    this.state.isDown = false
    const { activeClass, el } = this.props
    el.classList.remove(activeClass)
    return this
  },
  manageState() {
    if (!this.state.isOn) return
    const { el } = this.props
    el.addEventListener('mousemove', (e) => this.mouseMove(e))
    el.addEventListener('mousedown', (e) => this.mouseDown(e))
    el.addEventListener('mouseleave', () => this.mouseNotDown())
    el.addEventListener('mouseup', () => this.mouseNotDown())
    return this
  },
  init() {
    if (!this.canUseMousecase(target, this.props.rule)) return
    this.state.isOn = true
    this.manageState()
    target.addEventListener('wheel', (e) => {
      const _scrollLeft = target.scrollLeft
      // const _scrollBehavior = target.style.scrollBehavior
      if (e.deltaY > 0) target.scrollLeft += 100
      else target.scrollLeft -= 100
      target.style.scrollBehavior = ''
      if (_scrollLeft !== target.scrollLeft) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  },
  off() {
    this.state.isOn = false
    return this
  },
  on() {
    this.state.isOn = true
    return this
  },
})

export default mousecase