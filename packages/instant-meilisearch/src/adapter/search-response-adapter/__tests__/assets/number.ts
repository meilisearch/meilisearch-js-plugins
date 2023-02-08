/**
 * @param  {number} dividend
 * @param  {number} divisor
 * @returns number
 */
export function ceiledDivision(dividend: number, divisor: number): number {
  if (divisor > 0) {
    const NumberPages = Math.ceil(dividend / divisor) // total number of pages rounded up to the next largest integer.
    return NumberPages
  }
  return 0
}
