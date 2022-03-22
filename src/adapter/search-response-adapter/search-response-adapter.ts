import type {
  SearchContext,
  MeiliSearchResponse,
  AlgoliaSearchResponse,
} from '../../types'
import { ceiledDivision } from '../../utils'
import { adaptHits } from './hits-adapter'

/**
 * Adapt search response from Meilisearch
 * to search response compliant with instantsearch.js
 *
 * @param  {MeiliSearchResponse<Record<string} searchResponse
 * @param  {SearchContext} searchContext
 * @param  {PaginationContext} paginationContext
 * @returns {{ results: Array<AlgoliaSearchResponse<T>> }}
 */
export function adaptSearchResponse<T>(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  searchContext: SearchContext
): { results: Array<AlgoliaSearchResponse<T>> } {
  const searchResponseOptionals: Record<string, any> = {}

  const facets = searchResponse.facetsDistribution
  const { pagination } = searchContext

  const exhaustiveFacetsCount = searchResponse?.exhaustiveFacetsCount
  if (exhaustiveFacetsCount) {
    searchResponseOptionals.exhaustiveFacetsCount = exhaustiveFacetsCount
  }

  const nbPages = ceiledDivision(
    searchResponse.hits.length,
    pagination.hitsPerPage
  )
  const hits = adaptHits(searchResponse.hits, searchContext, pagination)

  const exhaustiveNbHits = searchResponse.exhaustiveNbHits
  const nbHits = searchResponse.nbHits
  const processingTimeMs = searchResponse.processingTimeMs
  const query = searchResponse.query

  const { hitsPerPage, page } = pagination

  // Create response object compliant with InstantSearch
  const adaptedSearchResponse = {
    index: searchContext.indexUid,
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
