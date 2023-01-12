import { PaginationState } from '../types'

/**
 * Create the current state of the pagination
 *
 * @param  {boolean} [finite]
 * @param  {number} [hitsPerPage]
 * @param  {number} [page]
 * @returns {SearchContext}
 */
export function createPaginationState(
  finite?: boolean,
  hitsPerPage?: number,
  page?: number
): PaginationState {
  return {
    hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the Meilisearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
    page: page || 0, // default page is 0 if none is provided
    finite: !!finite,
  }
}
