import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  AlgoliaSearchResponse,
  AlgoliaMultipleQueriesQuery,
} from '../types'
import {
  adaptSearchRequest,
  adaptSearchResponse,
  facetsDistributionAdapter,
} from '../adapter'
import { cacheFilters } from '../cache'

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
        const isSearchRequest = instantSearchRequests[0]
        const { params: instantSearchParams, indexName } = isSearchRequest

        const {
          paginationTotalHits,
          primaryKey,
          placeholderSearch,
        } = meiliSearchOptions

        const page = instantSearchParams?.page
        const hitsPerPage = instantSearchParams?.hitsPerPage
        const client = this.MeiliSearchClient

        const query = instantSearchParams?.query
        // Split index name and possible sorting rules
        const [indexUid, ...sortByArray] = indexName.split(':')

        const context = {
          client,
          paginationTotalHits: paginationTotalHits || 200,
          primaryKey: primaryKey || undefined,
          placeholderSearch: placeholderSearch !== false, // true by default
          hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
          page: page || 0, // default page is 0 if none is provided
          sort: sortByArray.join(':') || '',
          query,
        }

        // Adapt IS params to MeiliSearch params
        const msSearchParams = adaptSearchRequest(
          instantSearchParams,
          context.paginationTotalHits,
          context.placeholderSearch,
          context.sort,
          context.query
        )
        const cachedFacet = cacheFilters(msSearchParams?.filter)

        // Executes the search with MeiliSearch
        const searchResponse = await client
          .index(indexUid)
          .search(query, msSearchParams)

        // Add the checked facet attributes in facetsDistribution and give them a value of 0
        searchResponse.facetsDistribution = facetsDistributionAdapter(
          cachedFacet,
          searchResponse.facetsDistribution
        )

        // Parses the MeiliSearch response and returns it for InstantSearch
        const ISresponse = adaptSearchResponse<T>(
          indexUid,
          searchResponse,
          instantSearchParams,
          context
        )
        return ISresponse
      } catch (e) {
        console.error(e)
        return e
        // throw new Error(e)
      }
    },
    //   type SearchForFacetValuesResponse = {
    //     facetHits: FacetHit[];
    //     exhaustiveFacetsCount: boolean;
    //     processingTimeMS?: number | undefined;
    // }

    //   type FacetHit = {
    //     readonly value: string;
    //     readonly highlighted: string;
    //     readonly count: number;
    // }

    searchForFacetValues: async function (_) {
      return await new Promise((resolve, reject) => {
        resolve([
          {
            exhaustiveFacetsCount: false,
            facetHits: [
              {
                value: 'Not compatible with MeiliSearch',
                highlighted: 'Not compatible with MeiliSearch',
                count: 0,
              },
            ],
          },
        ])
        reject(new Error('ahhh'))
      })
    },
  }
}
