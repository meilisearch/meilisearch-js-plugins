import type {
  MultiSearchResult,
  InstantSearchPagination,
  PaginationState,
} from '../../types'

function adaptNbPages(
  searchResponse: MultiSearchResult<Record<string, any>>,
  hitsPerPage: number
): number {
  if (searchResponse.totalPages != null) {
    return searchResponse.totalPages
  }
  // Avoid dividing by 0
  if (hitsPerPage === 0) {
    return 0
  }

  const { limit = 20, offset = 0, hits } = searchResponse
  const additionalPage = hits.length >= limit ? 1 : 0

  return offset / hitsPerPage + 1 + additionalPage
}

export function adaptPaginationParameters(
  searchResponse: MultiSearchResult<Record<string, any>>,
  paginationState: PaginationState
): InstantSearchPagination & { nbPages: number } {
  const { hitsPerPage, page } = paginationState
  const nbPages = adaptNbPages(searchResponse, hitsPerPage)

  return {
    page,
    nbPages,
    hitsPerPage,
  }
}
