import {
  InstantMeiliSearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
} from '../types'

import { createPaginationState } from './pagination-context'

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createSearchContext(
  searchRequest: AlgoliaMultipleQueriesQuery,
  options: InstantMeiliSearchOptions
): SearchContext {
  // Split index name and possible sorting rules
  const [indexUid, ...sortByArray] = searchRequest.indexName.split(':')
  const { params: instantSearchParams } = searchRequest

  const paginationState = createPaginationState(
    options.finitePagination,
    instantSearchParams?.hitsPerPage,
    instantSearchParams?.page
  )

  const sort = [];
  for (let i = 0; i < sortByArray.length; i += 2) {
    sort.push(sortByArray[i] + ':' + sortByArray[i + 1])
  }

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: sort || '',
    indexUid,
    pagination: paginationState,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }
  return searchContext
}
