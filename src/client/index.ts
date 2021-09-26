import { MeiliSearch } from 'meilisearch'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  RequestOptions,
} from '../types'
import { adaptToMeiliSearchParams, adaptToISResponse } from '../adapter'
import { addMissingFacetZeroFields, cacheFilters } from '../cache'
import {
  SearchResponse,
  SearchOptions,
  MultipleQueriesQuery,
  MultipleQueriesResponse,
  MultipleQueriesOptions,
} from '@algolia/client-search'
import { SearchForFacetValuesResponse } from 'instantsearch.js'

/*

readonly type?: "default" | "facet" | undefined;
    readonly indexName: string;
    readonly params?: SearchOptions | undefined;
    readonly query?: string | undefined;
*/
type merde = Record<string, any>;

export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  meiliSearchOptions: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    search: async function <T = Record<string, any>>(
      instantSearchRequests: readonly MultipleQueriesQuery[],
      _?: RequestOptions & MultipleQueriesOptions
    ): Promise<{ results: Array<SearchResponse<T>> }> {
      try {
        const isSearchRequest = instantSearchRequests[0]
        const { params: instantSearchParams, indexName } = isSearchRequest

        const {
          paginationTotalHits,
          primaryKey,
          placeholderSearch,
        } = meiliSearchOptions
        // const { page, hitsPerPage } = instantSearchParams
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
        const msSearchParams = adaptToMeiliSearchParams(
          instantSearchParams,
          context
        )
        const cachedFacet = cacheFilters(msSearchParams.filter)

        // Executes the search with MeiliSearch
        const searchResponse = await client
          .index(indexUid)
          .search(query, msSearchParams)

        // Add the checked facet attributes in facetsDistribution and give them a value of 0
        searchResponse.facetsDistribution = addMissingFacetZeroFields(
          cachedFacet,
          searchResponse.facetsDistribution
        )

        // Parses the MeiliSearch response and returns it for InstantSearch
        const ISresponse = adaptToISResponse(
          indexUid,
          searchResponse,
          instantSearchParams,
          context
        )

        // Argument of type 'SearchOptions | (SearchOptions & { readonly facetQuery?: string | undefined; }) | undefined' is not assignable to parameter of type 'IMSearchParams'.
        // Type 'undefined' is not assignable to type 'IMSearchParams'.
        //   Type 'undefined' is not assignable to type 'Omit<SearchParameters, "facetFilters" | "filters">'.ts(2345)
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
