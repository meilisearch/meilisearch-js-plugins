import { Meilisearch } from 'meilisearch'
import type {
  InstantMeilisearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetDistribution,
  PaginationState,
  MeilisearchConfig,
  AlgoliaSearchForFacetValuesRequests,
  AlgoliaSearchForFacetValuesResponse,
  InstantMeilisearchObject,
  ApiKeyCallback,
  MeilisearchSearchResponse,
} from '../types/index.js'
import {
  getApiKey,
  getInstantMeilisearchConfig,
  validateInstantMeilisearchParams,
} from './config/index.js'
import {
  adaptSearchResults,
  adaptSearchParams,
  SearchResolver,
} from '../adapter/index.js'
import {
  createSearchContext,
  createFacetSearchContext,
} from '../contexts/index.js'
import {
  SearchCache,
  initFacetDistribution,
  getParametersWithoutFilters,
  fillMissingFacets,
} from '../cache/index.js'
import { constructClientAgents } from './agents.js'

/**
 * Instantiate SearchClient required by instantsearch.js.
 *
 * @param {string} hostUrl
 * @param {string | ApiKeyCallback} [apiKey=''] Default is `''`
 * @param {InstantMeilisearchOptions} [instantMeilisearchOptions={}] Default is
 *   `{}`
 * @returns {InstantMeilisearchObject}
 */
export function instantMeilisearch(
  hostUrl: string,
  apiKey: string | ApiKeyCallback = '',
  instantMeilisearchOptions: InstantMeilisearchOptions = {}
): InstantMeilisearchObject {
  // Validate parameters
  validateInstantMeilisearchParams(hostUrl, apiKey, instantMeilisearchOptions)

  // Resolve possible function to get apiKey
  apiKey = getApiKey(apiKey)

  const clientAgents = constructClientAgents(
    instantMeilisearchOptions.clientAgents
  )

  const meilisearchConfig: MeilisearchConfig = {
    host: hostUrl,
    apiKey,
    clientAgents,
  }

  if (instantMeilisearchOptions.httpClient !== undefined) {
    meilisearchConfig.httpClient = instantMeilisearchOptions.httpClient
  }

  if (instantMeilisearchOptions.requestInit !== undefined) {
    meilisearchConfig.requestInit = instantMeilisearchOptions.requestInit
  }

  const meilisearchClient = new Meilisearch(meilisearchConfig)

  const searchCache = SearchCache()
  // create search resolver with included cache
  const searchResolver = SearchResolver(meilisearchClient, searchCache)

  let initialFacetDistribution: Record<string, FacetDistribution> = {}

  const instantMeilisearchConfig = getInstantMeilisearchConfig(
    instantMeilisearchOptions
  )

  return {
    meiliSearchInstance: meilisearchClient,
    setMeilisearchParams: (params): void => {
      const { meiliSearchParams } = instantMeilisearchOptions

      instantMeilisearchOptions.meiliSearchParams =
        meiliSearchParams === undefined
          ? params
          : {
              ...meiliSearchParams,
              ...params,
              indexesOverrides: {
                ...(meiliSearchParams.indexesOverrides || {}),
                ...(params.indexesOverrides || {}),
              },
            }
    },
    searchClient: {
      clearCache: () => searchCache.clearCache(),
      /**
       * @param {readonlyAlgoliaMultipleQueriesQuery[]} instantSearchRequests
       * @returns {Array}
       */
      search: async function <T = Record<string, any>>(
        instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
      ): Promise<{ results: Array<MeilisearchSearchResponse<T>> }> {
        try {
          const meilisearchRequests = []
          const instantSearchPagination: PaginationState[] = []
          const initialFacetDistributionsRequests = []

          for (const searchRequest of instantSearchRequests) {
            const searchContext: SearchContext = createSearchContext(
              searchRequest,
              instantMeilisearchOptions
            )

            // Adapt the search parameters provided by instantsearch to
            // search parameters that are compliant with Meilisearch
            const meilisearchSearchQuery = adaptSearchParams(searchContext)
            meilisearchRequests.push(meilisearchSearchQuery)

            // Create a parameter without any filters to be able to store the default facet distribution
            const defaultSearchQuery =
              getParametersWithoutFilters(searchContext)
            initialFacetDistributionsRequests.push(defaultSearchQuery)

            // Keep information about the pagination parameters of instantsearch as
            // they are needed to adapt the search response of Meilisearch
            instantSearchPagination.push(searchContext.pagination)
          }

          initialFacetDistribution = await initFacetDistribution(
            searchResolver,
            initialFacetDistributionsRequests,
            initialFacetDistribution
          )

          // Search request to Meilisearch happens here
          const meilisearchResults = await searchResolver.multiSearch(
            meilisearchRequests,
            instantSearchPagination // Create issue on pagination
          )

          // Fill the missing facet values if keepZeroFacets is true
          initialFacetDistribution = fillMissingFacets(
            initialFacetDistribution,
            meilisearchResults
          )

          const instantSearchResponse = adaptSearchResults<T>(
            meilisearchResults,
            initialFacetDistribution,
            instantMeilisearchConfig
          )

          return instantSearchResponse
        } catch (e: any) {
          console.error(e)
          throw new Error(e?.message ?? String(e), { cause: e })
        }
      },
      searchForFacetValues: async function (
        requests: AlgoliaSearchForFacetValuesRequests
      ): Promise<AlgoliaSearchForFacetValuesResponse[]> {
        const results = []
        for (const request of requests) {
          const searchContext: SearchContext = createFacetSearchContext(
            request,
            instantMeilisearchOptions
          )

          const meilisearchSearchQuery = adaptSearchParams(searchContext)

          const meilisearchRequest: any = {
            ...meilisearchSearchQuery,
            facetQuery: request.params.facetQuery,
            facetName: request.params.facetName,
          }

          delete meilisearchRequest.indexUid

          const meilisearchResponse = await meilisearchClient
            .index(searchContext.indexUid)
            .searchForFacetValues(meilisearchRequest)

          const facetHits = meilisearchResponse.facetHits.map((facetHit) => ({
            ...facetHit,
            // not currently supported
            highlighted: facetHit.value,
          }))

          const result = {
            facetHits,
            exhaustiveFacetsCount: false,
            processingTimeMS: meilisearchResponse.processingTimeMs,
          }

          results.push(result)
        }

        return results
      },
    },
  }
}
