import { SearchCacheInterface } from '../types'
import { stringifyArray } from '../utils'
/**
 * @param  {Record<string} cache
 * @returns {SearchCache}
 */
export function SearchCache(
  cache: Record<string, string> = {}
): SearchCacheInterface {
  let searchCache = cache
  return {
    getEntry: function <T>(key: string): T | undefined {
      if (searchCache[key]) {
        try {
          return JSON.parse(searchCache[key])
        } catch (_) {
          return undefined
        }
      }
      return undefined
    },
    formatKey: function (components: any[]) {
      return stringifyArray(components)
    },
    setEntry: function <T>(key: string, searchResponse: T) {
      searchCache[key] = JSON.stringify(searchResponse)
    },
    clearCache: function () {
      searchCache = {}
    },
  }
}
