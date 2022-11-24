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

  const currentIndex = ''
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
        const searchResponses: { results: Array<AlgoliaSearchResponse<T>> } = {
          results: [],
        }

        const log = false

        // const indexes = new Set()
        // const requests = instantSearchRequests.filter((obj) => {
        //   if (indexes.has(obj.indexName)) return false
        //   return indexes.add(obj.indexName)
        // })
        // const requests = [instantSearchRequests[0], instantSearchRequests[2]]
        // const requests = [instantSearchRequests[0]]
        const requests = instantSearchRequests
        console.log(JSON.stringify(instantSearchRequests, null, 2))

        for (const searchRequest of requests) {
          if (log) {
            console.log('@@@@@@')
            console.log('Instantsearch request')
            console.log(JSON.stringify(searchRequest, null, 2))
          }
          // console.log(searchRequest)
          const searchContext: SearchContext = createSearchContext(
            searchRequest,
            instantMeiliSearchOptions,
            defaultFacetDistribution
          )

          // if (currentIndex !== searchRequest.indexName) {
          //   currentIndex = searchRequest.indexName
          //   searchContext.keepZeroFacets = false
          // } else {
          //   searchContext.keepZeroFacets =
          //     instantMeiliSearchOptions.keepZeroFacets
          // }
          // Adapt search request to Meilisearch compliant search request
          const adaptedSearchRequest = adaptSearchParams(searchContext)

          if (log) {
            console.log('Meilisearch request')
            console.log(adaptedSearchRequest)
          }

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
          // console.log('search request')

          // Adapt the Meilisearch response to a compliant instantsearch.js response
          const adaptedSearchResponse = adaptSearchResponse<T>(
            searchResponse,
            searchContext
          )
          if (log) {
            console.log('Search responses')
            console.log(adaptedSearchResponse.results[0])
          }

          // console.log(JSON.stringify(defaultFacetDistribution, null, 2))

          searchResponses.results.push(adaptedSearchResponse.results[0])
        }
        // console.log('Search responses')
        // console.log(searchResponses)
        console.log(searchResponses)

        // console.log(searchResponses.results)
        // console.log('----')

        return searchResponses
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
