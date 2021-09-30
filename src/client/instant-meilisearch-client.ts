import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  InstantSearchParams,
  Context,
  SearchContext,
  PaginationContext,
} from '../types'
import {
  adaptSearchResponse,
  adaptSearchParams,
  SearchResolver,
} from '../adapter'
import { SearchCache } from '../cache/search-cache'

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
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  // create search resolver with included cache
  const searchResolver = SearchResolver(SearchCache())

  const context: Context = {
    primaryKey: options.primaryKey || undefined,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    paginationTotalHits: options.paginationTotalHits || 200,
  }

  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),

    /**
     * @param  {readonlyAlgoliaMultipleQueriesQuery[]} instantSearchRequests
     * @returns {Array}
     */
    search: async function <T = Record<string, any>>(
      instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
    ): Promise<{ results: Array<AlgoliaSearchResponse<T>> }> {
      try {
        const searchRequest = instantSearchRequests[0]
        const { params: instantSearchParams } = searchRequest

        const searchContext: SearchContext = createSearchContext(
          searchRequest,
          context
        )

        const paginationContext = createPaginationContext(
          searchContext,
          instantSearchParams
        )

        // Adapt search request to MeiliSearch compliant search request
        const adaptedSearchRequest = adaptSearchParams(searchContext)

        const searchResponse = await searchResolver.searchResponse(
          searchContext,
          adaptedSearchRequest,
          this.MeiliSearchClient
        )

        // Adapt the MeiliSearch responsne to a compliant instantsearch.js response
        const adaptedSearchResponse = adaptSearchResponse<T>(
          searchResponse,
          searchContext,
          paginationContext
        )
        return adaptedSearchResponse
      } catch (e: any) {
        console.error(e)
        throw new Error(e)
      }
    },
    searchForFacetValues: async function (_) {
      return await new Promise((resolve, reject) => {
        reject(
          new Error('SearchForFacetValues is not compatible with MeiliSearch')
        )
        resolve([]) // added here to avoid compilation error
      })
    },
  }
}

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
function createSearchContext(
  searchRequest: AlgoliaMultipleQueriesQuery,
  options: Context
): SearchContext {
  console.log(searchRequest)

  // Split index name and possible sorting rules
  const [indexUid, ...sortByArray] = searchRequest.indexName.split(':')
  const { params: instantSearchParams } = searchRequest
  console.log({ indexUid, sortByArray })

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: sortByArray.join(':') || '',
    indexUid,
  }
  return searchContext
}

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
function createPaginationContext(
  searchContext: SearchContext,
  params: InstantSearchParams
): PaginationContext {
  return {
    paginationTotalHits: searchContext.paginationTotalHits || 200,
    hitsPerPage:
      searchContext.hitsPerPage === undefined ? 20 : searchContext.hitsPerPage, // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
    page: params?.page || 0, // default page is 0 if none is provided
  }
}
