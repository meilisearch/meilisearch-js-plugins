import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetDistribution,
  PaginationState,
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
import { createSearchContext } from '../contexts'
import {
  SearchCache,
  initFacetDistribution,
  getParametersWithoutFilters,
} from '../cache/'
import { constructClientAgents } from './agents'

/**
 * Instantiate SearchClient required by instantsearch.js.
 * @param  {string} hostUrl
 * @param  {string | apiKeyCallback} apiKey
 * @param  {InstantMeiliSearchOptions={}} meiliSearchOptions
 * @returns {InstantMeiliSearchInstance}
 */
export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string | (() => string) = '',
  instantMeiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  // Validate parameters
  validateInstantMeiliSearchParams(hostUrl, apiKey)

  // Resolve possible function to get apiKey
  apiKey = getApiKey(apiKey)

  const clientAgents = constructClientAgents(
    instantMeiliSearchOptions.clientAgents
  )

  const meilisearchClient = new MeiliSearch({
    host: hostUrl,
    apiKey,
    clientAgents,
  })

  const searchCache = SearchCache()
  // create search resolver with included cache
  const searchResolver = SearchResolver(meilisearchClient, searchCache)

  let initialFacetDistribution: Record<string, FacetDistribution> = {}

  const instantMeilisearchConfig = getInstantMeilisearchConfig(
    instantMeiliSearchOptions
  )
  return {
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
          const defaultSearchQuery = getParametersWithoutFilters(searchContext)
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
    searchForFacetValues: async function (_: any) {
      return await new Promise((resolve, reject) => {
        reject(
          new Error('SearchForFacetValues is not compatible with Meilisearch')
        )
        resolve([]) // added here to avoid compilation error
      })
    },
  }
}
