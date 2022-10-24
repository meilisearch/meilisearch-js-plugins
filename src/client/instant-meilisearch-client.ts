import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetDistribution,
} from '../types'
import {
  adaptSearchResponse,
  adaptSearchParams,
  SearchResolver,
} from '../adapter'
import { createSearchContext } from '../contexts'
import { SearchCache, cacheFirstFacetDistribution } from '../cache/'
import { constructClientAgents } from './agents'
import { validateInstantMeiliSearchParams } from '../utils'

/**
 * apiKey callback definition
 * @callback apiKeyCallback
 * @returns {string} - The apiKey to use
 */

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
    apiKey: apiKey,
    clientAgents,
  })

  const searchCache = SearchCache()
  // create search resolver with included cache
  const searchResolver = SearchResolver(meilisearchClient, searchCache)

  let defaultFacetDistribution: FacetDistribution

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
        const searchRequest = instantSearchRequests[0]
        const searchContext: SearchContext = createSearchContext(
          searchRequest,
          instantMeiliSearchOptions,
          defaultFacetDistribution
        )

        // Adapt search request to Meilisearch compliant search request
        const adaptedSearchRequest = adaptSearchParams(searchContext)

        // Cache first facets distribution of the instantMeilisearch instance
        // Needed to add in the facetDistribution the fields that were not returned
        // When the user sets `keepZeroFacets` to true.
        if (defaultFacetDistribution === undefined) {
          defaultFacetDistribution = await cacheFirstFacetDistribution(
            searchResolver,
            searchContext
          )
          searchContext.defaultFacetDistribution = defaultFacetDistribution
        }

        // Search response from Meilisearch
        const searchResponse = await searchResolver.searchResponse(
          searchContext,
          adaptedSearchRequest
        )

        // Adapt the Meilisearch responsne to a compliant instantsearch.js response
        const adaptedSearchResponse = adaptSearchResponse<T>(
          searchResponse,
          searchContext
        )

        return adaptedSearchResponse
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

/**
 * Resolves apiKey if it is a function
 * @param  {string | apiKeyCallback} apiKey
 * @returns {string} api key value
 */
function getApiKey(apiKey: string | (() => string)): string {
  // If apiKey is function, call it to get the apiKey
  if (typeof apiKey === 'function') {
    const apiKeyFnValue = apiKey()
    if (typeof apiKeyFnValue !== 'string') {
      throw new TypeError(
        'Provided apiKey function (2nd parameter) did not return a string, expected string'
      )
    }

    return apiKeyFnValue
  }

  return apiKey
}
