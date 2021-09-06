import { AdaptToMeiliSearchParams, Filter } from '../types'

const replaceFilterSyntax = (filter: string) => {
  return filter.replace(/:(.*)/i, '="$1"')
}

/*
 * Adapt InstantSearch filters to MeiliSearch filters
 * changes equal comparison sign from `:` to `=` in nested filter object
 * example: [`genres:comedy`] becomes [`genres=comedy`]
 */
const facetFiltersToMeiliSearchFilter = (filters?: Filter): Filter => {
  if (typeof filters === 'string') {
    // will only change first occurence of `:`
    return replaceFilterSyntax(filters)
  } else if (Array.isArray(filters))
    return filters.map((filter) => {
      if (Array.isArray(filter))
        return filter.map((nestedFilter) => replaceFilterSyntax(nestedFilter))
      else {
        return replaceFilterSyntax(filter)
      }
    })
  return []
}

const mergeFilters = (
  facetFilters: Filter,
  filters: string,
  numericFilters: string[]
) => {
  const mergedFilters = [numericFilters.join(' AND '), filters.trim()]
    .filter((x) => x)
    .join(' AND ')
    .trim()
  if (Array.isArray(facetFilters) && mergedFilters)
    return [...facetFilters, [mergedFilters]]
  if (typeof facetFilters === 'string' && mergedFilters)
    return [facetFilters, [mergedFilters]]
  return facetFilters
}

export const adaptToMeiliSearchParams: AdaptToMeiliSearchParams = function (
  {
    query,
    facets,
    facetFilters,
    attributesToSnippet: attributesToCrop,
    attributesToRetrieve,
    attributesToHighlight,
    filters = '',
    numericFilters = [],
  },
  { paginationTotalHits, placeholderSearch, sort }
) {
  const limit = paginationTotalHits
  const meilisearchFilters = facetFiltersToMeiliSearchFilter(facetFilters)
  const filter = mergeFilters(meilisearchFilters, filters, numericFilters)

  // Creates search params object compliant with MeiliSearch
  return {
    q: query,
    ...(facets?.length && { facetsDistribution: facets }),
    ...(attributesToCrop && { attributesToCrop }),
    ...(attributesToRetrieve && { attributesToRetrieve }),
    ...(filter && { filter: filter }),
    attributesToHighlight: attributesToHighlight || ['*'],
    limit: (!placeholderSearch && query === '') || !limit ? 0 : limit,
    ...(sort && { sort: [sort] }),
  }
}
