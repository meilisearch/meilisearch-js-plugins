import { AdaptToMeiliSearchParams } from '../types'

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
  const filter = [numericFilters.join(' AND '), filters.trim()]
    .filter((x) => x)
    .join(' AND ')
    .trim()

  // Creates search params object compliant with MeiliSearch
  return {
    q: query,
    ...(facets?.length && { facetsDistribution: facets }),
    ...(facetFilters && { facetFilters }),
    ...(attributesToCrop && { attributesToCrop }),
    ...(attributesToRetrieve && { attributesToRetrieve }),
    ...(filter && { filters: filter }),
    attributesToHighlight: attributesToHighlight || ['*'],
    limit: (!placeholderSearch && query === '') || !limit ? 0 : limit,
  }
}
