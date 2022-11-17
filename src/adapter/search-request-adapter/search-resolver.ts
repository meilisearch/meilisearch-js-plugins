import {
  SearchContext,
  MeiliSearch,
  MeiliSearchResponse,
  SearchCacheInterface,
  MeiliSearchParams,
} from '../../types'
import { addMissingFacets, extractFacets } from './filters'

/**
 * @param  {ResponseCacher} cache
 */
export function SearchResolver(
  client: MeiliSearch,
  cache: SearchCacheInterface
) {
  return {
    /**
     * @param  {SearchContext} searchContext
     * @param  {MeiliSearchParams} searchParams
     * @param  {MeiliSearch} client
     * @returns {Promise}
     */
    searchResponse: async function (
      searchContext: SearchContext,
      searchParams: MeiliSearchParams
    ): Promise<MeiliSearchResponse<Record<string, any>>> {
      const { placeholderSearch, query } = searchContext

      // Create cache key containing a unique set of search parameters
      const key = cache.formatKey([
        searchParams,
        searchContext.indexUid,
        searchContext.query,
        searchContext.pagination,
      ])
      const cachedResponse = cache.getEntry(key)

      // Check if specific request is already cached with its associated search response.
      if (cachedResponse) return cachedResponse

      const cachedFacets = extractFacets(searchContext, searchParams)

      // Make search request
      const searchResponse = await client
        .index(searchContext.indexUid)
        .search(searchContext.query, searchParams)

      // Add missing facets back into facetDistribution
      searchResponse.facetDistribution = addMissingFacets(
        cachedFacets,
        searchResponse.facetDistribution
      )

      // query can be: empty string, undefined or null
      // all of them are falsy's
      if (!placeholderSearch && !query) {
        searchResponse.hits = []
      }
      // Cache response
      cache.setEntry<MeiliSearchResponse>(key, searchResponse)
      return searchResponse
    },
  }
}
