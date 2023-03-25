/**
 * @param {string} rawSort
 * @returns {string[]}
 */
export function createSortState(rawSort: string): string[] {
  return rawSort
    .split(',')
    .map((sort) => sort.trim())
    .filter((sort) => !!sort)
}
