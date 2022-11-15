import type { MeiliSearchResponse, PaginationContext } from '../../types'
import { ceiledDivision } from '../../utils'

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
    page,
    nbPages,
    hitsPerPage,
  }
}
