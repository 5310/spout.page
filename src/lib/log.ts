export default (...args: any[]) => {
  // tslint:disable-next-line: no-console
  if ((self as any).LOG) console.log(...args)
}