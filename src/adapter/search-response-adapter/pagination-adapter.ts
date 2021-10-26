/**
 * Slice the requested hits based on the pagination position.
 *
 * @param  {Record<string} hits
 * @param  {number} page
 * @param  {number} hitsPerPage
 * @returns {Array}
 */
export function adaptPagination(
  hits: Record<string, any>,
  page: number,
  hitsPerPage: number
): Array<Record<string, any>> {
  if (hitsPerPage < 0) {
    throw new TypeError(
      'Value too small for "hitsPerPage" parameter, expected integer between 0 and 9223372036854775807'
    )
  }
  const start = page * hitsPerPage
  return hits.slice(start, start + hitsPerPage)
}
