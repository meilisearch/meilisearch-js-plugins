/**
 * Apply a function to a single value or an array of values
 * @param value - The value or array of values to apply the function to
 * @param mapFn - The function to apply to the value or array of values
 * @returns The result of the function applied to the value or array of values
 */
export function mapOneOrMany<T, U>(
  value: T | T[],
  mapFn: (value: T) => U
): U | U[] {
  return Array.isArray(value) ? value.map(mapFn) : mapFn(value)
}
