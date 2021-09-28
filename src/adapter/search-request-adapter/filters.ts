import {
  Filter,
  ParsedFilter,
  FacetsDistribution,
  FilterCache,
} from '../../types'
import { removeUndefined } from '../../utils'

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
 * @returns {Array}
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
 * @returns {FilterCache}
 */
export function cacheFilters(filters?: Filter): FilterCache {
  const extractedFilters = extractFilters(filters)
  const cleanFilters = removeUndefined(extractedFilters)
  return cleanFilters.reduce<FilterCache>(
    (cache, parsedFilter: ParsedFilter) => {
      const { filterName, value } = parsedFilter
      const prevFields = cache[filterName] || []
      cache = {
        ...cache,
        [filterName]: [...prevFields, value],
      }
      return cache
    },
    {} as FilterCache
  )
}

/**
 * Assign missing filters to facetsDistribution.
 * All facet passed as filter should appear in the facetsDistribution.
 * If not present, the facet is added with 0 as value.
 *
 *
 * @param  {FilterCache} cache?
 * @param  {FacetsDistribution} distribution?
 * @returns {FacetsDistribution}
 */
export function assignMissingFilters(
  cache?: FilterCache,
  distribution?: FacetsDistribution
): FacetsDistribution {
  distribution = distribution || {}
  if (cache && Object.keys(cache).length > 0) {
    for (const cachedFacet in cache) {
      for (const cachedField of cache[cachedFacet]) {
        // if cached field is not present in the returned distribution

        if (
          !distribution[cachedFacet] ||
          !Object.keys(distribution[cachedFacet]).includes(cachedField)
        ) {
          // add 0 value
          distribution[cachedFacet] = distribution[cachedFacet] || {}
          distribution[cachedFacet][cachedField] = 0
        }
      }
    }
  }
  return distribution
}
