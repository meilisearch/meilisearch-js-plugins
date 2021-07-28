import { FacetsDistribution, Filter, Cache, ParsedFilter } from '../types'
import { removeUndefined } from '../utils'

const parseFilter = (filter: string) => {
  const matches = filter.match(/([^=]*)="?([^\\"]*)"?$/)
  if (matches) {
    const [_, filterName, value] = matches
    return [{ filterName, value }]
  }
  return [undefined]
}

const parseFilters = (filters?: Filter): Array<ParsedFilter | undefined> => {
  if (typeof filters === 'string') {
    return parseFilter(filters)
  } else if (Array.isArray(filters)) {
    return filters
      .map((nestedFilter) => {
        if (Array.isArray(nestedFilter)) {
          return nestedFilter.map((filter) => parseFilter(filter))
        }
        return parseFilter(nestedFilter)
      })
      .flat(2)
  }
  return [undefined]
}

export const cacheFilters = (filters?: Filter): Cache => {
  const parsedFilters = parseFilters(filters)
  const cleanFilters = removeUndefined(parsedFilters)
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

export const addMissingFacetZeroFields = (
  cache?: Cache,
  distribution?: FacetsDistribution
) => {
  distribution = distribution || {}
  if (cache && Object.keys(cache).length > 0) {
    for (const cachedFacet in cache) {
      for (const cachedField of cache[cachedFacet]) {
        // if cached field is not present in the returned distribution
        // console.log({ distribution })

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
