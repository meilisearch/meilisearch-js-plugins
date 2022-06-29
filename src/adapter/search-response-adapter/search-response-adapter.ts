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

  const facets = searchResponse.facetDistribution
  const { pagination } = searchContext

  const nbPages = ceiledDivision(
    searchResponse.hits.length,
    pagination.hitsPerPage
  )
  const hits = adaptHits(searchResponse.hits, searchContext, pagination)

  const estimatedTotalHits = searchResponse.estimatedTotalHits
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
    nbHits: estimatedTotalHits,
    processingTimeMS: processingTimeMs,
    query,
    hits,
    params: '',
    exhaustiveNbHits: false,
    ...searchResponseOptionals,
  }
  return {
    results: [adaptedSearchResponse],
  }
}
