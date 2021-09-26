import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
  InstantSearchParams,
} from '../types'
import {
  adaptSearchRequest,
  adaptSearchResponse,
  facetsDistributionAdapter,
} from '../adapter'
import { cacheFilters } from '../cache'

function createContext(
  indexName: string,
  params: InstantSearchParams,
  meiliSearchOptions: InstantMeiliSearchOptions = {},
  MeiliSearchClient: MeiliSearch
) {
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
    client: MeiliSearchClient,
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

export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  meiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    search: async function <T = Record<string, any>>(
      instantSearchRequests: readonly AlgoliaMultipleQueriesQuery[]
      // options?: RequestOptions & MultipleQueriesOptions - When is this used ?
    ): Promise<{ results: Array<AlgoliaSearchResponse<T>> }> {
      try {
        const searchRequest = instantSearchRequests[0]
        const { params: instantSearchParams } = searchRequest

        const context = createContext(
          searchRequest.indexName,
          instantSearchParams,
          meiliSearchOptions,
          this.MeiliSearchClient
        )

        // Adapt search request to MeiliSearch compliant search request
        const adaptedSearchRequest = adaptSearchRequest(
          instantSearchParams,
          context.paginationTotalHits,
          context.placeholderSearch,
          context.sort,
          context.query
        )

        // Cache filters
        const cachedFacet = cacheFilters(adaptedSearchRequest?.filter)

        // Executes the search with MeiliSearch
        const searchResponse = await context.client
          .index(context.indexUid)
          .search(context.query, adaptedSearchRequest)

        // Add the checked facet attributes in facetsDistribution and give them a value of 0
        searchResponse.facetsDistribution = facetsDistributionAdapter(
          cachedFacet,
          searchResponse.facetsDistribution
        )

        // Adapt the MeiliSearch responsne to a compliant instantsearch.js response
        const adaptedSearchResponse = adaptSearchResponse<T>(
          context.indexUid,
          searchResponse,
          instantSearchParams,
          context
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
