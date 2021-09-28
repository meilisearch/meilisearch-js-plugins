import { SearchCacheInterface, MeiliSearchResponse } from '../types'
import { stringifyArray } from '../utils'
/**
 * @param  {Record<string} cache
 * @returns {SearchCache}
 */
export function SearchCache(
  cache: Record<string, string> = {}
): SearchCacheInterface {
  const searchCache = cache
  return {
    getEntry: function (key: string) {
      if (searchCache[key]) return JSON.parse(searchCache[key])
      return undefined
    },
    formatKey: function (components: any[]) {
      return stringifyArray(components)
    },
    setEntry: function (searchResponse: MeiliSearchResponse, key: string) {
      searchCache[key] = JSON.stringify(searchResponse)
    },
  }
}
