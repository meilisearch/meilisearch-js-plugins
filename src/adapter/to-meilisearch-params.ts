import { AdaptToMeiliSearchParams, SubFilter, Filter } from '../types'

/*
 * Adapt InstantSearch filters to MeiliSearch filters
 * changes equal comparison sign from `:` to `=` in nested filter object
 * example: [`genres:comedy`] becomes [`genres=comedy`]
 */
const adaptFacetFilters = (
  deepness: number,
  facetFilters?: Filter | SubFilter
): Filter => {
  if (!facetFilters) return []
  if (typeof facetFilters === 'string') {
    // will only change first occurence of `:`
    return facetFilters.replace(/:(.*)/i, '="$1"')
  } else if (Array.isArray(facetFilters))
    return facetFilters.map((facet) => {
      return adaptFacetFilters(deepness + 1, facet)
    })
  return []
}

const parseFilter = (
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
  { paginationTotalHits, placeholderSearch }
) {
  const limit = paginationTotalHits
  facetFilters = adaptFacetFilters(0, facetFilters)
  const filter = parseFilter(facetFilters, filters, numericFilters)

  // Creates search params object compliant with MeiliSearch
  return {
    q: query,
    ...(facets?.length && { facetsDistribution: facets }),
    ...(attributesToCrop && { attributesToCrop }),
    ...(attributesToRetrieve && { attributesToRetrieve }),
    ...(filter && { filter: filter }),
    attributesToHighlight: attributesToHighlight || ['*'],
    limit: (!placeholderSearch && query === '') || !limit ? 0 : limit,
  }
}
