import type { InstantSearchParams, MeiliSearchParams } from '../../types'

import { adaptFilters } from './filter-adapter'

/**
 * Adapt search request from instantsearch.js
 * to search request compliant with MeiliSearch
 *
 * @param  {InstantSearchParams} instantSearchParams
 * @param  {number} paginationTotalHits
 * @param  {boolean} placeholderSearch
 * @param  {string} sort?
 * @param  {string} query?
 * @returns MeiliSearchParams
 */
export function adaptSearchParams(
  instantSearchParams: InstantSearchParams,
  paginationTotalHits: number,
  placeholderSearch: boolean,
  sort?: string,
  query?: string
): MeiliSearchParams {
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
  const filter = adaptFilters(
    instantSearchParams?.filters,
    instantSearchParams?.numericFilters,
    instantSearchParams?.facetFilters
  )
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
