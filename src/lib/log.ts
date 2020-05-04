const LOG = true

export default (...args: any[]) => {
  // tslint:disable-next-line: no-console
  if (LOG) console.log(...args)
}