/**
 * @param  {any} str
 * @returns {boolean}
 */
export function isString(str: any): boolean {
  return typeof str === 'string' || str instanceof String
}

/**
 * @param  {any[]} arr
 * @returns {string}
 */
export function stringifyArray(arr: any[]): string {
  return arr.reduce((acc: string, curr: any) => {
    return (acc += JSON.stringify(curr))
  }, '')
}
