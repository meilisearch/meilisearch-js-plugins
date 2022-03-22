import { PaginationContext, PaginationParams } from '../types'

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createPaginationContext({
  paginationTotalHits,
  hitsPerPage,
  page,
}: PaginationParams): // searchContext: SearchContext
PaginationContext {
  return {
    paginationTotalHits:
      paginationTotalHits != null ? paginationTotalHits : 200,
    hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the Meilisearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
    page: page || 0, // default page is 0 if none is provided
  }
}
