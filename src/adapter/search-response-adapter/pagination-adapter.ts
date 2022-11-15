import type {
  MeiliSearchResponse,
  PaginationState,
  InstantSearchPagination,
} from '../../types'
import { ceiledDivision, floorDivision } from '../../utils'

function adaptNbPages(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  hitsPerPage: number
): number {
  if (searchResponse.totalPages != null) {
    return searchResponse.totalPages
  }

  return ceiledDivision(searchResponse.hits.length, hitsPerPage)
}

function adaptPage(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  hitsPerPage: number
): number {
  const { limit, page } = searchResponse
  if (page === 0) {
    return 0
  }
  if (page != null) {
    return page - 1
  }

  if (!limit) {
    return 0
  } else {
    return floorDivision(limit, hitsPerPage) - 1
  }
}

export function adaptPaginationParameters(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  paginationState: PaginationState
): InstantSearchPagination & { nbPages: number } {
  const hitsPerPage = paginationState.hitsPerPage
  const nbPages = adaptNbPages(searchResponse, hitsPerPage)
  const page = adaptPage(searchResponse, hitsPerPage)

  return {
    page,
    nbPages,
    hitsPerPage,
  }
}
