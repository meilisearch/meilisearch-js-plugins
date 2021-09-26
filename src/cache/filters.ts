import { Filter, Cache, ParsedFilter } from '../types'
import { removeUndefined } from '../utils'

/**
 * @param  {string} filter
 */
const adaptFilterSyntax = (filter: string) => {
  const matches = filter.match(/([^=]*)="?([^\\"]*)"?$/)
  if (matches) {
    const [_, filterName, value] = matches
    return [{ filterName, value }]
  }
  return [undefined]
}

/**
 * @param  {Filter} filters?
 * @returns Array
 */
function extractFilters(filters?: Filter): Array<ParsedFilter | undefined> {
  if (typeof filters === 'string') {
    return adaptFilterSyntax(filters)
  } else if (Array.isArray(filters)) {
    return filters
      .map((nestedFilter) => {
        if (Array.isArray(nestedFilter)) {
          return nestedFilter.map((filter) => adaptFilterSyntax(filter))
        }
        return adaptFilterSyntax(nestedFilter)
      })
      .flat(2)
  }
  return [undefined]
}

/**
 * @param  {Filter} filters?
 * @returns Cache
 */
export function cacheFilters(filters?: Filter): Cache {
  const extractedFilters = extractFilters(filters)
  const cleanFilters = removeUndefined(extractedFilters)
  return cleanFilters.reduce<Cache>((cache, parsedFilter: ParsedFilter) => {
    const { filterName, value } = parsedFilter
    const prevFields = cache[filterName] || []
    cache = {
      ...cache,
      [filterName]: [...prevFields, value],
    }
    return cache
  }, {} as Cache)
}
