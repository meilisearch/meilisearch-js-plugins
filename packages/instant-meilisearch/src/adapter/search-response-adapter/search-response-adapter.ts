import type {
  AlgoliaSearchResponse,
  FacetDistribution,
  InstantMeiliSearchConfig,
  MeilisearchMultiSearchResult,
} from '../../types/index.js'
import { adaptHits } from './hits-adapter.js'
import { adaptTotalHits } from './total-hits-adapter.js'
import { adaptPaginationParameters } from './pagination-adapter.js'
import { adaptFacetDistribution } from './facet-distribution-adapter.js'
import { adaptFacetStats } from './adapt-facet-stats.js'

/**
 * Adapt multiple search results from Meilisearch to search results compliant
 * with instantsearch.js
 *
 * @param {MeilisearchMultiSearchResult<T>[]} searchResponse
 * @param {Record<string, FacetDistribution>} initialFacetDistribution
 * @param {InstantMeiliSearchConfig} config
 * @returns {{ results: AlgoliaSearchResponse<T>[] }}
 */
export function adaptSearchResults<T = Record<string, any>>(
  meilisearchResults: MeilisearchMultiSearchResult[],
  initialFacetDistribution: Record<string, FacetDistribution>,
  config: InstantMeiliSearchConfig
): { results: Array<AlgoliaSearchResponse<T>> } {
  const instantSearchResult: Array<AlgoliaSearchResponse<T>> =
    meilisearchResults.map((meilisearchResult) => {
      return adaptSearchResult<T>(
        meilisearchResult,
        initialFacetDistribution[meilisearchResult.indexUid],
        config
      )
    })

  return { results: instantSearchResult }
}

/**
 * Adapt search result from Meilisearch to search result compliant with
 * instantsearch.js
 *
 * @param {MeilisearchMultiSearchResult<Record<string>>} searchResponse
 * @param {Record<string, FacetDistribution>} initialFacetDistribution
 * @param {InstantMeiliSearchConfig} config
 * @returns {AlgoliaSearchResponse<T>}
 */
export function adaptSearchResult<T>(
  meiliSearchResult: MeilisearchMultiSearchResult,
  initialFacetDistribution: FacetDistribution,
  config: InstantMeiliSearchConfig
): AlgoliaSearchResponse<T> {
  const {
    processingTimeMs,
    query,
    indexUid,
    facetDistribution: responseFacetDistribution = {},
    facetStats = {},
  } = meiliSearchResult

  const facets = Object.keys(responseFacetDistribution)

  const { hitsPerPage, page, nbPages } = adaptPaginationParameters(
    meiliSearchResult,
    meiliSearchResult.pagination
  )

  const hits = adaptHits(meiliSearchResult, config)
  const nbHits = adaptTotalHits(meiliSearchResult)

  const facetDistribution = adaptFacetDistribution(
    config.keepZeroFacets,
    facets,
    initialFacetDistribution,
    responseFacetDistribution
  )

  // Create result object compliant with InstantSearch
  const adaptedSearchResult = {
    index: indexUid,
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
    facets_stats: adaptFacetStats(facetStats),
  }
  return adaptedSearchResult
}
