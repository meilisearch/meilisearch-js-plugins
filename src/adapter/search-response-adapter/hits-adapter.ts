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
    pagination: { finite, hitsPerPage },
  } = searchContext

  // if the length of the hits is bigger than the hitsPerPage
  // It means that there is still pages to come as we append limit by hitsPerPage + 1
  // In which case we still need to remove the additional hit returned by Meilisearch
  if (!finite && hits.length > hitsPerPage) {
    hits.splice(hits.length - 1, 1)
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
