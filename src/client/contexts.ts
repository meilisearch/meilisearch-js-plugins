import {
  InstantMeiliSearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetsDistribution,
} from '../types'

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createSearchContext(
  searchRequest: AlgoliaMultipleQueriesQuery,
  options: InstantMeiliSearchOptions,
  defaultFacetDistribution: FacetsDistribution
): SearchContext {
  // Split index name and possible sorting rules
  const [indexUid, ...sortByArray] = searchRequest.indexName.split(':')
  const { params: instantSearchParams } = searchRequest

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: sortByArray.join(':') || '',
    indexUid,
    defaultFacetDistribution,
    placeholderSearch: !options.placeholderSearch, // true by default
    paginationTotalHits:
      options.paginationTotalHits != null ? options.paginationTotalHits : 200,
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }
  return searchContext
}
