import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  InstantSearchParams,
  SearchContext,
} from '../types'
import {
  adaptSearchResponse,
  adaptSearchParams,
  SearchResolver,
} from '../adapter'
import { SearchCache } from '../cache/search-cache'

/**
 * Create search context.
 *
 * @param  {string} indexName
 * @param  {InstantSearchParams} params
 * @param  {InstantMeiliSearchOptions={}} meiliSearchOptions
 * @param  {MeiliSearch} MeiliSearchClient
 * @returns {SearchContext}
 */
function createContext(
  indexName: string,
  params: InstantSearchParams,
  meiliSearchOptions: InstantMeiliSearchOptions = {}
): SearchContext {
  const {
    paginationTotalHits,
    primaryKey,
    placeholderSearch,
  } = meiliSearchOptions

  const page = params?.page
  const hitsPerPage = params?.hitsPerPage

  const query = params?.query
  // Split index name and possible sorting rules
  const [indexUid, ...sortByArray] = indexName.split(':')

  const context = {
    indexUid: indexUid,
    paginationTotalHits: paginationTotalHits || 200,
    primaryKey: primaryKey || undefined,
    placeholderSearch: placeholderSearch !== false, // true by default
    hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
    page: page || 0, // default page is 0 if none is provided
    sort: sortByArray.join(':') || '',
    query,
  }
  return context
}

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
  apiKey: string,
  meiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  const searchResolver = SearchResolver(SearchCache())
  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    search: async function <T = Record<string, any>>(
      instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
      // options?: RequestOptions & MultipleQueriesOptions - When is this used ?
    ): Promise<{ results: Array<AlgoliaSearchResponse<T>> }> {
      try {
        const searchRequest = instantSearchRequests[0]
        const { params: instantSearchParams } = searchRequest

        const searchContext = createContext(
          searchRequest.indexName,
          instantSearchParams,
          meiliSearchOptions
        )

        // Adapt search request to MeiliSearch compliant search request
        const adaptedSearchRequest = adaptSearchParams(
          instantSearchParams,
          searchContext.paginationTotalHits,
          searchContext.placeholderSearch,
          searchContext.sort,
          searchContext.query
        )

        const searchResponse = await searchResolver.searchResponse(
          searchContext,
          adaptedSearchRequest,
          this.MeiliSearchClient
        )

        // Adapt the MeiliSearch responsne to a compliant instantsearch.js response
        const adaptedSearchResponse = adaptSearchResponse<T>(
          searchResponse,
          instantSearchParams,
          searchContext
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
