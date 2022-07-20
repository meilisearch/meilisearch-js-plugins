import type { MeiliSearchResponse, PaginationContext } from '../../types'
import { ceiledDivision } from '../../utils'

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

// export function adaptNbPages(): number {}
function adaptHitsPerPage(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  paginationContext: PaginationContext
): number {
  if (searchResponse.hitsPerPage) {
    return searchResponse.hitsPerPage
  }

  return paginationContext.hitsPerPage
}

function adaptNbPages(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  hitsPerPage: number
): number {
  if (searchResponse.totalPages) {
    return searchResponse.totalPages
  }

  return ceiledDivision(searchResponse.hits.length, hitsPerPage)
}

function adaptPage(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  paginationContext: PaginationContext
): number {
  if (searchResponse.page) {
    return searchResponse.page - 1
  }

  return paginationContext.page
}

export function adaptPaginationContext(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  paginationContext: PaginationContext
): PaginationContext & { nbPages: number } {
  const hitsPerPage = adaptHitsPerPage(searchResponse, paginationContext)
  const nbPages = adaptNbPages(searchResponse, hitsPerPage)
  const page = adaptPage(searchResponse, paginationContext)
  return {
    hitsPerPage,
    page,
    nbPages,
  }
}
