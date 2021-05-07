import { AdaptToISResponse } from '../types'
import { getNumberPages } from './pagination'
import { adaptToISHits } from './to-instantsearch-hits'

export const adaptToISResponse: AdaptToISResponse = function (
  indexUid,
  {
    exhaustiveFacetsCount,
    exhaustiveNbHits,
    facetsDistribution: facets,
    nbHits,
    processingTimeMs,
    query,
    hits,
  },
  instantSearchParams,
  instantMeiliSearchContext
) {
  // Create response object compliant with InstantSearch
  const { hitsPerPage, page } = instantMeiliSearchContext
  const ISResponse = {
    index: indexUid,
    hitsPerPage: hitsPerPage,
    ...(facets && { facets }),
    ...(exhaustiveFacetsCount && { exhaustiveFacetsCount }),
    page: page,
    nbPages: getNumberPages(hits.length, instantMeiliSearchContext),
    exhaustiveNbHits,
    nbHits,
    processingTimeMS: processingTimeMs,
    query,
    hits: adaptToISHits(hits, instantSearchParams, instantMeiliSearchContext),
  }
  return {
    results: [ISResponse],
  }
}
