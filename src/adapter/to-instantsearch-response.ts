import { InstantMeiliSearchContext, InstantSearchParams } from '../types'
import { SearchResponse } from 'meilisearch'
import { getNumberPages } from './pagination'
import { adaptToISHits } from './to-instantsearch-hits'

export function adaptToISResponse(
  indexUid: string,
  searchResponse: SearchResponse<Record<string, any>>,
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) {
  const searchResponseOptionals: Record<string, any> = {}

  const facets = searchResponse.facetsDistribution

  const exhaustiveFacetsCount = searchResponse?.exhaustiveFacetsCount
  if (exhaustiveFacetsCount) {
    searchResponseOptionals.exhaustiveFacetsCount = exhaustiveFacetsCount
  }

  const hits = adaptToISHits(
    searchResponse.hits,
    instantSearchParams,
    instantMeiliSearchContext
  )

  const nbPages = getNumberPages(
    hits.length,
    instantMeiliSearchContext.hitsPerPage
  )

  const exhaustiveNbHits = searchResponse.exhaustiveNbHits

  const nbHits = searchResponse.nbHits
  const processingTimeMs = searchResponse.processingTimeMs
  const query = searchResponse.query

  // Create response object compliant with InstantSearch
  const { hitsPerPage, page } = instantMeiliSearchContext

  const adaptedSearchResponse = {
    index: indexUid,
    hitsPerPage,
    page,
    facets,
    nbPages,
    exhaustiveNbHits,
    nbHits,
    processingTimeMS: processingTimeMs,
    query,
    hits,
    params: 'blabla',
    ...searchResponseOptionals,
  }
  return {
    results: [adaptedSearchResponse],
  }
}
