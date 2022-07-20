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
  facetDistribution: {},
  page: 0,
  hitsPerPage: 0,
  totalPages: 0,
  totalHits: 0,
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

      // Create cache key containing a unique set of search parameters
      const key = cache.formatKey([
        searchParams,
        searchContext.indexUid,
        searchContext.query,
      ])
      const cachedResponse = cache.getEntry(key)

      // Check if specific request is already cached with its associated search response.
      if (cachedResponse) return cachedResponse

      const facetsCache = extractFacets(searchContext, searchParams)
      console.log({ searchParams })

      // Make search request
      const searchResponse = await client
        .index(searchContext.indexUid)
        .search(searchContext.query, searchParams)

      // Add missing facets back into facetDistribution
      searchResponse.facetDistribution = addMissingFacets(
        facetsCache,
        searchResponse.facetDistribution
      )

      // Cache response
      cache.setEntry<MeiliSearchResponse>(key, searchResponse)
      return searchResponse
    },
  }
}
