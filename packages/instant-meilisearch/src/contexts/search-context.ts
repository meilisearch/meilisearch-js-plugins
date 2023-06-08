import {
  InstantMeiliSearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  AlgoliaSearchForFacetValuesRequest,
} from '../types'

import { createPaginationState } from './pagination-context'
import { createSortState } from './sort-context'

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
  const { query, params: instantSearchParams } = searchRequest

  const paginationState = createPaginationState(
    options.finitePagination,
    instantSearchParams?.hitsPerPage,
    instantSearchParams?.page
  )

  const sortState = createSortState(sortByArray.join(':'))

  const searchContext: SearchContext = {
    ...options,
    query,
    ...instantSearchParams,
    sort: sortState,
    indexUid,
    pagination: paginationState,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }
  return searchContext
}

// TODO: avoid code duplication
/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createFacetSearchContext(
  searchRequest: AlgoliaSearchForFacetValuesRequest,
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

  const sortState = createSortState(sortByArray.join(':'))

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: sortState,
    indexUid,
    pagination: paginationState,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }
  return searchContext
}
