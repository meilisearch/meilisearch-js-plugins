import {
  SearchContext,
  MeiliSearch,
  MeiliSearchResponse,
  SearchCacheInterface,
  MeiliSearchParams,
} from '../../types'
import { addMissingFacets, extractFacets } from './filters'

const emptySearch: MeiliSearchResponse<Record<string, any>> = {
  hits: [],
  query: '',
  facetsDistribution: {},
  limit: 0,
  offset: 0,
  exhaustiveNbHits: false,
  nbHits: 0,
  processingTimeMs: 0,
}

/**
 * @param  {ResponseCacher} cache
 */
export function SearchResolver(cache: SearchCacheInterface) {
  return {
    /**
     * @param  {SearchContext} searchContext
     * @param  {MeiliSearchParams} searchParams
     * @param  {MeiliSearch} client
     * @returns {Promise}
     */
    searchResponse: async function (
      searchContext: SearchContext,
      searchParams: MeiliSearchParams,
      client: MeiliSearch
    ): Promise<MeiliSearchResponse<Record<string, any>>> {
      const { placeholderSearch, query } = searchContext

      // query can be: empty string, undefined or null
      // all of them are falsy's
      if (!placeholderSearch && !query) {
        return emptySearch
      }

      const { pagination } = searchContext

      // In case we are in a `finitePagination`, only one big request is made
      // containing a total of max the paginationTotalHits (default: 200).
      // Thus we dont want the pagination to impact the cache as every
      // hits are already cached.
      const paginationCache = searchContext.finitePagination ? {} : pagination

      // Create cache key containing a unique set of search parameters
      const key = cache.formatKey([
        searchParams,
        searchContext.indexUid,
        searchContext.query,
        paginationCache,
      ])
      const cachedResponse = cache.getEntry(key)

      // Check if specific request is already cached with its associated search response.
      if (cachedResponse) return cachedResponse

      const facetsCache = extractFacets(searchContext, searchParams)

      // Make search request
      const searchResponse = await client
        .index(searchContext.indexUid)
        .search(searchContext.query, searchParams)

      // Add missing facets back into facetsDistribution
      searchResponse.facetsDistribution = addMissingFacets(
        facetsCache,
        searchResponse.facetsDistribution
      )

      // Cache response
      cache.setEntry<MeiliSearchResponse>(key, searchResponse)
      return searchResponse
    },
  }
}
