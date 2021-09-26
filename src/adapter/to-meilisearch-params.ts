import { AdaptToMeiliSearchParams, Filter } from '../types'

import { SearchOptions } from '@algolia/client-search'

const replaceFilterSyntax = (filter: string) => {
  return filter.replace(/:(.*)/i, '="$1"')
}

/*
 * Adapt InstantSearch filters to MeiliSearch filters
 * changes equal comparison sign from `:` to `=` in nested filter object
 * example: [`genres:comedy`] becomes [`genres=comedy`]
 */
function adaptFilter(filters?: SearchOptions['facetFilters']): Filter {
  if (typeof filters === 'string') {
    // will only change first occurence of `:`
    return replaceFilterSyntax(filters)
  } else if (Array.isArray(filters))
    return filters
      .map((filter) => {
        if (Array.isArray(filter))
          return filter
            .map((nestedFilter) => replaceFilterSyntax(nestedFilter))
            .filter((elem) => elem)
        else {
          return replaceFilterSyntax(filter)
        }
      })
      .filter((elem) => elem)
  return []
}

// const

function toArray(filter: Filter): Array<string | string[]> {
  // Filter is a string

  if (filter === '') return []
  else if (typeof filter === 'string') return [filter]
  // Filter is either an array of strings, or an array of array of strings
  return filter
}

function mergeFilters(
  facetFilters: Filter,
  numericFilters: Filter,
  filters: string
) {
  const adaptedFilters = filters.trim()
  const adaptedFacetFilters = toArray(facetFilters)
  const adaptedNumericFilters = toArray(numericFilters)

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

export const adaptToMeiliSearchParams: AdaptToMeiliSearchParams = function (
  instantSearchParams,
  { paginationTotalHits, placeholderSearch, sort, query }
) {
  // Creates search params object compliant with MeiliSearch
  const meiliSearchParams: Record<string, any> = {}

  // Facets
  const facets = instantSearchParams?.facets
  if (facets?.length) {
    meiliSearchParams.facetsDistribution = facets
  }

  // Attributes To Crop
  const attributesToCrop = instantSearchParams?.attributesToSnippet
  if (attributesToCrop) {
    meiliSearchParams.attributesToCrop = attributesToCrop
  }

  // Attributes To Retrieve
  const attributesToRetrieve = instantSearchParams?.attributesToRetrieve
  if (attributesToRetrieve) {
    meiliSearchParams.attributesToRetrieve = attributesToRetrieve
  }

  // Filter
  const filters = instantSearchParams?.filters || ''
  const numericFilters = instantSearchParams?.numericFilters || []
  const facetFilters = instantSearchParams?.facetFilters || []

  const adaptedFilters = adaptFilter(facetFilters)
  const adaptedNumericFilters = adaptFilter(numericFilters)

  const filter = mergeFilters(adaptedFilters, adaptedNumericFilters, filters)

  if (filter.length) {
    meiliSearchParams.filter = filter
  }

  // Attributes To Retrieve
  if (attributesToRetrieve) {
    meiliSearchParams.attributesToCrop = attributesToRetrieve
  }

  // Attributes To Highlight
  meiliSearchParams.attributesToHighlight = instantSearchParams?.attributesToHighlight || [
    '*',
  ]

  if ((!placeholderSearch && query === '') || paginationTotalHits === 0) {
    meiliSearchParams.limit = 0
  } else {
    meiliSearchParams.limit = paginationTotalHits
  }

  // Sort
  if (sort?.length) {
    meiliSearchParams.sort = [sort]
  }

  return meiliSearchParams
}
