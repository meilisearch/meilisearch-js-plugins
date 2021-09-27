import { adaptSearchRequest, adaptFacetsDistribution } from '..'
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
    cache,
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
      const key = cache.createKey([searchContext, instantsearchParams])
      const response = cache.getCachedValue(key)
      if (response) return response

      // Adapt search request to MeiliSearch compliant search request
      const adaptedSearchRequest = adaptSearchRequest(
        instantsearchParams,
        searchContext.paginationTotalHits,
        searchContext.placeholderSearch,
        searchContext.sort,
        searchContext.query
      )

      // Cache filters
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
      cache.populate(searchResponse, key)
      return searchResponse
    },
  }
}
