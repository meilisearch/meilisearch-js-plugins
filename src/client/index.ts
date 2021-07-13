import { MeiliSearch } from 'meilisearch'
import { InstantMeiliSearchOptions, InstantMeiliSearchInstance } from '../types'
import { adaptToMeiliSearchParams, adaptToISResponse } from '../adapter'
import { compareFilters, facetCache } from '../cache'

export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    search: async function ([isSearchRequest]) {
      try {
        // Params got from InstantSearch
        const {
          params: instantSearchParams,
          indexName: indexUid,
        } = isSearchRequest

        const { paginationTotalHits, primaryKey, placeholderSearch } = options
        const { page, hitsPerPage } = instantSearchParams
        const client = this.MeiliSearchClient
        const context = {
          client,
          paginationTotalHits: paginationTotalHits || 200,
          primaryKey: primaryKey || undefined,
          placeholderSearch: placeholderSearch !== false, // true by default
          hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
          page: page || 0, // default page is 0 if none is provided
        }

        // Adapt IS params to MeiliSearch params
        const msSearchParams = adaptToMeiliSearchParams(
          instantSearchParams,
          context
        )

        const cachedFacet = facetCache(msSearchParams.filter)

        // Executes the search with MeiliSearch
        const searchResponse = await client
          .index(indexUid)
          .search(msSearchParams.q, msSearchParams)

        searchResponse.facetsDistribution = compareFilters(
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

        return ISresponse
      } catch (e) {
        console.error(e)
        throw new Error(e)
      }
    },
  }
}
