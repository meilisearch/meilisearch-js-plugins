import { adaptSearchRequest, adaptFacetsDistribution } from '../adapter'
import {
  SearchContext,
  InstantSearchParams,
  MeiliSearch,
  MeiliSearchResponse,
  ResponseCacher,
} from '../types'
import { cacheFilters } from '../cache'

/**
 * @param  {ResponseCacher} cache
 */
export function SearchResolver(cache: ResponseCacher) {
  return {
    /**
     * @param  {SearchContext} searchContext
     * @param  {InstantSearchParams} instantsearchParams
     * @param  {MeiliSearch} client
     * @returns {Promise<MeiliSearchResponse<Record<string, any>>>}
     */
    searchResponse: async function (
      searchContext: SearchContext,
      instantsearchParams: InstantSearchParams,
      client: MeiliSearch
    ): Promise<MeiliSearchResponse<Record<string, any>>> {
      // Adapt search request to MeiliSearch compliant search request
      const adaptedSearchRequest = adaptSearchRequest(
        instantsearchParams,
        searchContext.paginationTotalHits,
        searchContext.placeholderSearch,
        searchContext.sort,
        searchContext.query
      )

      // Create key with relevant informations
      const key = cache.formatKey([
        adaptedSearchRequest,
        searchContext.indexUid,
        searchContext.query,
      ])
      const entry = cache.getEntry(key)

      // Request is cached.
      if (entry) return entry

      // Cache filters: todo components
      const filterCache = cacheFilters(adaptedSearchRequest?.filter)

      // Make search request
      const searchResponse = await client
        .index(searchContext.indexUid)
        .search(searchContext.query, adaptedSearchRequest)

      // Add facets back into facetsDistribution
      searchResponse.facetsDistribution = adaptFacetsDistribution(
        filterCache,
        searchResponse.facetsDistribution
      )

      // Cache response
      cache.setEntry(searchResponse, key)
      return searchResponse
    },
  }
}
