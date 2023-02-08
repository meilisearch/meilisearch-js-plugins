import type { Filter, SearchContext } from '../../types'
import { replaceColonByEqualSign } from '../../utils'

/**
 * Transform InstantSearch filter to Meilisearch filter.
 * Change sign from `:` to `=` in nested filter object.
 * example: [`genres:comedy`] becomes [`genres=comedy`]
 *
 * @param  {SearchContext['facetFilters']} filters?
 * @returns {Filter}
 */
function transformFilter(filters?: SearchContext['facetFilters']): Filter {
  if (typeof filters === 'string') {
    return replaceColonByEqualSign(filters)
  } else if (Array.isArray(filters))
    return filters
      .map((filter) => {
        if (Array.isArray(filter))
          return filter
            .map((nestedFilter) => replaceColonByEqualSign(nestedFilter))
            .filter((elem) => elem)
        else {
          return replaceColonByEqualSign(filter)
        }
      })
      .filter((elem) => elem)
  return []
}

/**
 * Return the filter in an array if it is a string
 * If filter is array, return without change.
 *
 * @param  {Filter} filter
 * @returns {Array}
 */
function filterToArray(filter: Filter): Array<string | string[]> {
  // Filter is a string

  if (filter === '') return []
  else if (typeof filter === 'string') return [filter]
  // Filter is either an array of strings, or an array of array of strings
  return filter
}

/**
 * Merge facetFilters, numericFilters and filters together.
 *
 * @param  {Filter} facetFilters
 * @param  {Filter} numericFilters
 * @param  {string} filters
 * @returns {Filter}
 */
function mergeFilters(
  facetFilters: Filter,
  numericFilters: Filter,
  filters: string
): Filter {
  const adaptedFilters = filters.trim()
  const adaptedFacetFilters = filterToArray(facetFilters)
  const adaptedNumericFilters = filterToArray(numericFilters)

  const adaptedFilter = [
    ...adaptedFacetFilters,
    ...adaptedNumericFilters,
    adaptedFilters,
  ]

  const cleanedFilters = adaptedFilter.filter((filter) => {
    if (Array.isArray(filter)) {
      return filter.length
    }
    return filter
  })
  return cleanedFilters
}

/**
 * Adapt instantsearch.js filters to Meilisearch filters by
 * combining and transforming all provided filters.
 *
 * @param  {string|undefined} filters
 * @param  {SearchContext['numericFilters']} numericFilters
 * @param  {SearchContext['facetFilters']} facetFilters
 * @returns {Filter}
 */
export function adaptFilters(
  filters: string | undefined,
  numericFilters: SearchContext['numericFilters'],
  facetFilters: SearchContext['facetFilters']
): Filter {
  const transformedFilter = transformFilter(facetFilters || [])
  const transformedNumericFilter = transformFilter(numericFilters || [])

  return mergeFilters(
    transformedFilter,
    transformedNumericFilter,
    filters || ''
  )
}
