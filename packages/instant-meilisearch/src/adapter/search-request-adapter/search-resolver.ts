import {
  MeiliSearch,
  SearchCacheInterface,
  MeiliSearchMultiSearchParams,
  MeilisearchMultiSearchResult,
  PaginationState,
} from '../../types'

/**
 * @param  {ResponseCacher} cache
 */
export function SearchResolver(
  client: MeiliSearch,
  cache: SearchCacheInterface
) {
  return {
    multiSearch: async function (
      searchQueries: MeiliSearchMultiSearchParams[],
      instantSearchPagination: PaginationState[]
    ): Promise<MeilisearchMultiSearchResult[]> {
      const key = cache.formatKey([searchQueries])

      const cachedResponse = cache.getEntry<MeilisearchMultiSearchResult[]>(key)

      // Check if specific request is already cached with its associated search response.
      if (cachedResponse) return cachedResponse

      const searchResponses = await client.multiSearch({
        queries: searchQueries,
      })

      const responseWithPagination = searchResponses.results.map(
        (response, index) => ({
          ...response,
          // TODO: should be removed at one point
          pagination: instantSearchPagination[index] || {},
        })
      )
      // Cache response
      cache.setEntry<MeilisearchMultiSearchResult[]>(
        key,
        responseWithPagination
      )

      return responseWithPagination
    },
  }
}
