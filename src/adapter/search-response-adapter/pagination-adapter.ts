import { SearchContext, PaginationContext } from '../../types'

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

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createPaginationContext(
  searchContext: SearchContext
): PaginationContext {
  return {
    paginationTotalHits: searchContext.paginationTotalHits || 200,
    hitsPerPage:
      searchContext.hitsPerPage === undefined ? 20 : searchContext.hitsPerPage, // 20 is the Meilisearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
    page: searchContext?.page || 0, // default page is 0 if none is provided
  }
}
