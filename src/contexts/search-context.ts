import {
  InstantMeiliSearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  FacetsDistribution,
} from '../types'

import { createPaginationContext } from './pagination-context'

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

  const pagination = createPaginationContext({
    paginationTotalHits: options.paginationTotalHits,
    hitsPerPage: instantSearchParams?.hitsPerPage, // 20 by default
    page: instantSearchParams?.page,
  })

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: sortByArray.join(':') || '',
    indexUid,
    pagination,
    defaultFacetDistribution,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
    finitePagination: !!options.finitePagination, // false by default
  }
  return searchContext
}
