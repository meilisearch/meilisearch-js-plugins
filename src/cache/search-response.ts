import { ResponseCacher, MeiliSearchResponse } from '../types'
import { stringifyArray } from '../utils'
/**
 * @param  {Record<string} cache
 * @returns {ResponseCacher}
 */
export function ResponseCache(
  cache: Record<string, string> = {}
): ResponseCacher {
  const searchCache = cache
  return {
    getCachedValue: function (key: string) {
      if (searchCache[key]) return JSON.parse(searchCache[key])
      return undefined
    },
    createKey: function (components: any[]) {
      return stringifyArray(components)
    },
    populate: function (searchResponse: MeiliSearchResponse, key: string) {
      searchCache[key] = JSON.stringify(searchResponse)
    },
  }
}
