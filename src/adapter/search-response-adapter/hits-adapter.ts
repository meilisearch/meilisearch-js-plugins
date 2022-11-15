import type { SearchContext, MeiliSearchResponse } from '../../types'
import { adaptFormattedFields } from './format-adapter'
import { adaptGeoResponse } from './geo-reponse-adapter'

/**
 * @param  {MeiliSearchResponse<Record<string, any>>} searchResponse
 * @param  {SearchContext} searchContext
 * @returns {Array<Record<string, any>>}
 */
export function adaptHits(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  searchContext: SearchContext
): any {
  const { primaryKey } = searchContext
  const { hits } = searchResponse
  const {
    pagination: { finite, page, hitsPerPage },
  } = searchContext

  if (!finite) {
    const deleteCount = page * hitsPerPage
    hits.splice(0, deleteCount)
    if (hits.length > hitsPerPage) {
      hits.splice(hits.length - 1, 1)
    }
  }
  let adaptedHits = hits.map((hit: Record<string, any>) => {
    // Creates Hit object compliant with InstantSearch
    if (Object.keys(hit).length > 0) {
      const {
        _formatted: formattedHit,
        _matchesPosition,
        ...documentFields
      } = hit

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
