export default (delay: number, f: any) => {
  let timeout: number
  return (...args: any[]) => {
    self.clearTimeout(timeout)
    timeout = self.setTimeout(() => f(...args), delay)
  }
}