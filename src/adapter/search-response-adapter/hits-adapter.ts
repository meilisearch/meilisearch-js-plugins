import type { PaginationContext, SearchContext } from '../../types'
import { adaptPagination } from './pagination-adapter'
import { adaptFormattedFields } from './format-adapter'
import { adaptGeoResponse } from './geo-reponse-adapter'

/**
 * @param  {Array<Record<string} hits
 * @param  {SearchContext} searchContext
 * @param  {PaginationContext} paginationContext
 * @returns {any}
 */
export function adaptHits(
  hits: Array<Record<string, any>>,
  searchContext: SearchContext,
  paginationContext: PaginationContext
): any {
  const { primaryKey } = searchContext
  const { hitsPerPage, page } = paginationContext
  const paginatedHits = adaptPagination(hits, page, hitsPerPage)

  let adaptedHits = paginatedHits.map((hit: Record<string, any>) => {
    // Creates Hit object compliant with InstantSearch
    if (Object.keys(hit).length > 0) {
      const { _formatted: formattedHit, _matchesInfo, ...documentFields } = hit

      const adaptedHit: Record<string, any> = Object.assign(
        documentFields,
        adaptFormattedFields(formattedHit)
      )

      if (primaryKey) {
        adaptedHit.objectID = hit[primaryKey]
      }
      return adaptedHit
    }
    return hit
  })
  adaptedHits = adaptGeoResponse(adaptedHits)
  return adaptedHits
}
