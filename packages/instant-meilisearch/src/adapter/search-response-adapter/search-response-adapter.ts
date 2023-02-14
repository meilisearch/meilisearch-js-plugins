import type {
  SearchContext,
  MeiliSearchResponse,
  AlgoliaSearchResponse,
  FacetDistribution,
} from '../../types'
import { adaptHits } from './hits-adapter'
import { adaptTotalHits } from './total-hits-adapter'
import { adaptPaginationParameters } from './pagination-adapter'
import { adaptFacetDistribution } from './facet-distribution-adapter'

/**
 * Adapt search response from Meilisearch
 * to search response compliant with instantsearch.js
 *
 * @param  {MeiliSearchResponse<Record<string>>} searchResponse
 * @param  {SearchContext} searchContext
 * @returns {{ results: Array<AlgoliaSearchResponse<T>> }}
 */
export function adaptSearchResponse<T>(
  searchResponse: MeiliSearchResponse<Record<string, any>>,
  searchContext: SearchContext,
  initialFacetDistribution: FacetDistribution
): AlgoliaSearchResponse<T> {
  const searchResponseOptionals: Record<string, any> = {}
  const {
    processingTimeMs,
    query,
    facetDistribution: responseFacetDistribution,
  } = searchResponse

  const { keepZeroFacets, facets } = searchContext

  const { hitsPerPage, page, nbPages } = adaptPaginationParameters(
    searchResponse,
    searchContext.pagination
  )

  const hits = adaptHits(searchResponse, searchContext)
  const nbHits = adaptTotalHits(searchResponse)

  const facetDistribution = adaptFacetDistribution(
    keepZeroFacets,
    facets,
    initialFacetDistribution,
    responseFacetDistribution
  )

  // Create response object compliant with InstantSearch
  const adaptedSearchResponse = {
    index: searchContext.indexUid,
    hitsPerPage,
    page,
    facets: facetDistribution,
    nbPages,
    nbHits,
    processingTimeMS: processingTimeMs,
    query,
    hits,
    params: '',
    exhaustiveNbHits: false,
    ...searchResponseOptionals,
  }
  return adaptedSearchResponse
}
