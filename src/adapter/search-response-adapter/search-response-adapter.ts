import type {
  SearchContext,
  MeiliSearchResponse,
  AlgoliaSearchResponse,
} from '../../types'
import { adaptHits } from './hits-adapter'
import { adaptTotalHits } from './total-hits-adapter'
import { adaptPaginationContext } from './pagination-adapter'

/**
 * Adapt search response from Meilisearch
 * to search response compliant with instantsearch.js
 *
 * @param  {MeiliSearchResponse<Record<string>>} searchResponse
 * @param  {SearchContext} searchContext
 * @param  {PaginationContext} paginationContext
 * @returns {{ results: Array<AlgoliaSearchResponse<T>> }}
 */
export function adaptSearchResponse<T>(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  searchContext: SearchContext
): { results: Array<AlgoliaSearchResponse<T>> } {
  const searchResponseOptionals: Record<string, any> = {}
  const { processingTimeMs, query, facetDistribution: facets } = searchResponse

  const { hitsPerPage, page, nbPages } = adaptPaginationContext(
    searchResponse,
    searchContext.pagination
  )
  const hits = adaptHits(searchResponse.hits, searchContext)

  const nbHits = adaptTotalHits(searchResponse)

  // Create response object compliant with InstantSearch
  const adaptedSearchResponse = {
    index: searchContext.indexUid,
    hitsPerPage,
    page,
    facets,
    nbPages,
    nbHits, // TODO: UPDATE
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
