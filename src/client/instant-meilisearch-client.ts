import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
} from '../types'
import {
  adaptSearchResponse,
  adaptSearchParams,
  SearchResolver,
} from '../adapter'
import { createSearchContext } from '../contexts'
import { SearchCache, cacheFirstFacetsDistribution } from '../cache/'

/**
 * Instanciate SearchClient required by instantsearch.js.
 *
 * @param  {string} hostUrl
 * @param  {string} apiKey
 * @param  {InstantMeiliSearchOptions={}} meiliSearchOptions
 * @returns {InstantMeiliSearchInstance}
 */
export function instantMeiliSearch(
  hostUrl: string,
  apiKey = '',
  instantMeiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  // create search resolver with included cache
  const searchResolver = SearchResolver(SearchCache())
  // paginationTotalHits can be 0 as it is a valid number
  let defaultFacetDistribution: any = {}
  const meilisearchClient = new MeiliSearch({ host: hostUrl, apiKey: apiKey })

  return {
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

        // Search response from Meilisearch
        const searchResponse = await searchResolver.searchResponse(
          searchContext,
          adaptedSearchRequest,
          meilisearchClient
        )

        // Cache first facets distribution of the instantMeilisearch instance
        // Needed to add in the facetsDistribution the fields that were not returned
        // When the user sets `keepZeroFacets` to true.
        defaultFacetDistribution = cacheFirstFacetsDistribution(
          defaultFacetDistribution,
          searchResponse
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
