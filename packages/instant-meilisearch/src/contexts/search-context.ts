import {
  InstantMeiliSearchOptions,
  AlgoliaMultipleQueriesQuery,
  SearchContext,
  AlgoliaSearchForFacetValuesRequest,
} from '../types'
import { splitSortString } from './sort-context'
import { createPaginationState } from './pagination-context'

function separateIndexFromSortRules(indexName: string): {
  indexUid: string
  sortBy: string
} {
  const colonIndex = indexName.indexOf(':')
  if (colonIndex === -1) {
    return {
      indexUid: indexName,
      sortBy: '',
    }
  }
  return {
    indexUid: indexName.substring(0, colonIndex),
    sortBy: indexName.substring(colonIndex + 1),
  }
}

/**
 * @param  {AlgoliaMultipleQueriesQuery} searchRequest
 * @param  {Context} options
 * @returns {SearchContext}
 */
export function createSearchContext(
  searchRequest: AlgoliaMultipleQueriesQuery,
  options: InstantMeiliSearchOptions
): SearchContext {
  const { query, indexName, params: instantSearchParams } = searchRequest
  // Split index name and possible sorting rules
  const { indexUid, sortBy } = separateIndexFromSortRules(indexName)

  const paginationState = createPaginationState(
    options.finitePagination,
    instantSearchParams?.hitsPerPage,
    instantSearchParams?.page
  )

  const searchContext: SearchContext = {
    ...options,
    query,
    ...instantSearchParams,
    sort: splitSortString(sortBy),
    indexUid,
    pagination: paginationState,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }
  return searchContext
}

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
  const { indexUid, sortBy } = separateIndexFromSortRules(
    searchRequest.indexName
  )
  const { params: instantSearchParams } = searchRequest

  const paginationState = createPaginationState(
    options.finitePagination,
    instantSearchParams?.hitsPerPage,
    instantSearchParams?.page
  )

  const searchContext: SearchContext = {
    ...options,
    ...instantSearchParams,
    sort: splitSortString(sortBy),
    indexUid,
    pagination: paginationState,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    keepZeroFacets: !!options.keepZeroFacets, // false by default
  }

  return searchContext
}
