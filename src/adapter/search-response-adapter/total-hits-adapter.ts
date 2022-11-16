import type { MeiliSearchResponse } from '../../types'

export function adaptTotalHits(
  searchResponse: MeiliSearchResponse<Record<string, any>>
): number {
  const {
    hitsPerPage = 0,
    totalPages = 0,
    estimatedTotalHits,
    totalHits,
  } = searchResponse
  if (estimatedTotalHits != null) {
    return estimatedTotalHits
  } else if (totalHits != null) {
    return totalHits
  }

  // Should not happen but safeguarding just in case
  return hitsPerPage * totalPages
}
