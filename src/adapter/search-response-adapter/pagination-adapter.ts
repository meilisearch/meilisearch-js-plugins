/**
 * Slice the requested hits based on the pagination position.
 *
 * @param  {Record<string} hits
 * @param  {number} page
 * @param  {number} hitsPerPage
 * @returns Array
 */
export function adaptPagination(
  hits: Record<string, any>,
  page: number,
  hitsPerPage: number
): Array<Record<string, any>> {
  const start = page * hitsPerPage
  return hits.splice(start, hitsPerPage)
}
