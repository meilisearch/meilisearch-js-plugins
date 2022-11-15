import type { MeiliSearchResponse } from '../../types'

export function adaptTotalHits(
  searchResponse: MeiliSearchResponse<Record<string, any>>
): number {
  const {
    hitsPerPage = 0,
    totalPages = 0,
    estimatedTotalHits = undefined,
    totalHits = undefined,
  } = searchResponse
  if (estimatedTotalHits !== undefined) {
    return estimatedTotalHits
  } else if (totalHits !== undefined) {
    return totalHits
  }

  // Should not happen but safeguarding just in case
  return hitsPerPage * totalPages
}
