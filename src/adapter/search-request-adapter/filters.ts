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
  return []
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
  return []
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
  cachedFilters?: FilterCache,
  distribution?: FacetsDistribution
): FacetsDistribution {
  distribution = distribution || {}

  // If cachedFilters contains something
  if (cachedFilters && Object.keys(cachedFilters).length > 0) {
    // for all filters in cached filters
    for (const cachedFacet in cachedFilters) {
      // if facet does not exist on returned distribution, add an empty object
      if (!distribution[cachedFacet]) distribution[cachedFacet] = {}
      // for all fields in every filter
      for (const cachedField of cachedFilters[cachedFacet]) {
        // if the field is not present in the returned distribution
        // set it at 0
        if (!Object.keys(distribution[cachedFacet]).includes(cachedField)) {
          // add 0 value
          distribution[cachedFacet][cachedField] = 0
        }
      }
    }
  }
  return distribution
}
