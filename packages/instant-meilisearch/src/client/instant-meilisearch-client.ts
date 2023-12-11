import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetDistribution,
  PaginationState,
  MeilisearchConfig,
  AlgoliaSearchForFacetValuesRequests,
  AlgoliaSearchForFacetValuesResponse,
  InstantMeiliSearchObject,
  ApiKeyCallback,
} from '../types'
import {
  getApiKey,
  getInstantMeilisearchConfig,
  validateInstantMeiliSearchParams,
} from './config'
import {
  adaptSearchResults,
  adaptSearchParams,
  SearchResolver,
} from '../adapter'
import { createSearchContext, createFacetSearchContext } from '../contexts'
import {
  SearchCache,
  initFacetDistribution,
  getParametersWithoutFilters,
  fillMissingFacets,
} from '../cache/'
import { constructClientAgents } from './agents'

/**
 * Instantiate SearchClient required by instantsearch.js.
 *
 * @param  {string} hostUrl
 * @param  {string | ApiKeyCallback} [apiKey='']
 * @param  {InstantMeiliSearchOptions} [instantMeiliSearchOptions={}]
 * @returns {InstantMeiliSearchObject}
 */
export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string | ApiKeyCallback = '',
  instantMeiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchObject {
  // Validate parameters
  validateInstantMeiliSearchParams(hostUrl, apiKey, instantMeiliSearchOptions)

  // Resolve possible function to get apiKey
  apiKey = getApiKey(apiKey)

  const clientAgents = constructClientAgents(
    instantMeiliSearchOptions.clientAgents
  )

  const meilisearchConfig: MeilisearchConfig = {
    host: hostUrl,
    apiKey,
    clientAgents,
  }

  if (instantMeiliSearchOptions.httpClient !== undefined) {
    meilisearchConfig.httpClient = instantMeiliSearchOptions.httpClient
  }

  if (instantMeiliSearchOptions.requestConfig !== undefined) {
    meilisearchConfig.requestConfig = instantMeiliSearchOptions.requestConfig
  }

  const meilisearchClient = new MeiliSearch(meilisearchConfig)

  const searchCache = SearchCache()
  // create search resolver with included cache
  const searchResolver = SearchResolver(meilisearchClient, searchCache)

  let initialFacetDistribution: Record<string, FacetDistribution> = {}

  const instantMeilisearchConfig = getInstantMeilisearchConfig(
    instantMeiliSearchOptions
  )
  return {
    setMeiliSearchParams: (params): void => {
      const { meiliSearchParams } = instantMeiliSearchOptions
      instantMeiliSearchOptions.meiliSearchParams =
        meiliSearchParams === undefined
          ? params
          : {
              ...meiliSearchParams,
              ...params,
            }
    },
    searchClient: {
      clearCache: () => searchCache.clearCache(),
      /**
       * @param  {readonlyAlgoliaMultipleQueriesQuery[]} instantSearchRequests
       * @returns {Array}
       */
      search: async function <T = Record<string, any>>(
        instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
      ): Promise<{ results: Array<AlgoliaSearchResponse<T>> }> {
        try {
          const meilisearchRequests = []
          const instantSearchPagination: PaginationState[] = []
          const initialFacetDistributionsRequests = []

          for (const searchRequest of instantSearchRequests) {
            const searchContext: SearchContext = createSearchContext(
              searchRequest,
              instantMeiliSearchOptions
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
          throw new Error(e)
        }
      },
      searchForFacetValues: async function (
        requests: AlgoliaSearchForFacetValuesRequests
      ): Promise<AlgoliaSearchForFacetValuesResponse[]> {
        const results = []
        for (const request of requests) {
          const searchContext: SearchContext = createFacetSearchContext(
            request,
            instantMeiliSearchOptions
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
