import { TransformToISResponse } from '../types/types'
import { getNumberPages } from './pagination'
import { transformToISHits } from './to-instantsearch-hits'

export const transformToISResponse: TransformToISResponse = function (
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
    hits: transformToISHits(
      hits,
      instantSearchParams,
      instantMeiliSearchContext
    ),
  }
  return {
    results: [ISResponse],
  }
}
