import type {
  SearchContext,
  InstantSearchParams,
  MeiliSearchResponse,
  AlgoliaSearchResponse,
} from '../types'
import { ceiledDivision } from '../utils'
import { adaptHits } from './hits-adapter'

/**
 * Adapt search response from MeiliSearch
 * to search response compliant with instantsearch.js
 *
 * @param  {string} indexUid
 * @param  {MeiliSearchResponse<Record<string} searchResponse
 * @param  {InstantSearchParams} instantSearchParams
 * @param  {SearchContext} instantMeiliSearchContext
 * @returns Array
 */
export function adaptSearchResponse<T>(
  indexUid: string,
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: SearchContext
): { results: Array<AlgoliaSearchResponse<T>> } {
  const searchResponseOptionals: Record<string, any> = {}

  const facets = searchResponse.facetsDistribution

  const exhaustiveFacetsCount = searchResponse?.exhaustiveFacetsCount
  if (exhaustiveFacetsCount) {
    searchResponseOptionals.exhaustiveFacetsCount = exhaustiveFacetsCount
  }

  const hits = adaptHits(
    searchResponse.hits,
    instantSearchParams,
    instantMeiliSearchContext
  )

  const nbPages = ceiledDivision(
    hits.length,
    instantMeiliSearchContext.hitsPerPage
  )

  const exhaustiveNbHits = searchResponse.exhaustiveNbHits
  const nbHits = searchResponse.nbHits
  const processingTimeMs = searchResponse.processingTimeMs
  const query = searchResponse.query

  const { hitsPerPage, page } = instantMeiliSearchContext

  // Create response object compliant with InstantSearch
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
    params: '',
    ...searchResponseOptionals,
  }
  return {
    results: [adaptedSearchResponse],
  }
}
