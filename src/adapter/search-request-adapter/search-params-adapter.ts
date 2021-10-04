import type { MeiliSearchParams, SearchContext } from '../../types'

import { adaptFilters } from './filter-adapter'

/**
 * Adapt search request from instantsearch.js
 * to search request compliant with MeiliSearch
 *
 * @param  {SearchContext} searchContext
 * @returns {MeiliSearchParams}
 */
export function adaptSearchParams(
  searchContext: SearchContext
): MeiliSearchParams {
  // Creates search params object compliant with MeiliSearch
  const meiliSearchParams: Record<string, any> = {}

  // Facets
  const facets = searchContext?.facets
  if (facets?.length) {
    meiliSearchParams.facetsDistribution = facets
  }

  // Attributes To Crop
  const attributesToCrop = searchContext?.attributesToSnippet
  if (attributesToCrop) {
    meiliSearchParams.attributesToCrop = attributesToCrop
  }

  // Attributes To Retrieve
  const attributesToRetrieve = searchContext?.attributesToRetrieve
  if (attributesToRetrieve) {
    meiliSearchParams.attributesToRetrieve = attributesToRetrieve
  }

  // Filter
  const filter = adaptFilters(
    searchContext?.filters,
    searchContext?.numericFilters,
    searchContext?.facetFilters
  )
  if (filter.length) {
    meiliSearchParams.filter = filter
  }

  // Attributes To Retrieve
  if (attributesToRetrieve) {
    meiliSearchParams.attributesToCrop = attributesToRetrieve
  }

  // Attributes To Highlight
  meiliSearchParams.attributesToHighlight = searchContext?.attributesToHighlight || [
    '*',
  ]

  const placeholderSearch = meiliSearchParams.placeholderSearch
  const query = meiliSearchParams.query
  const paginationTotalHits = meiliSearchParams.paginationTotalHits

  if ((!placeholderSearch && query === '') || paginationTotalHits === 0) {
    meiliSearchParams.limit = 0
  } else {
    meiliSearchParams.limit = paginationTotalHits
  }

  const sort = searchContext.sort
  // Sort
  if (sort?.length) {
    meiliSearchParams.sort = [sort]
  }

  const insideBoundingBox = adaptGeoPoint(instantSearchParams?.insideBoundingBox)
  if (insideBoundingBox) {

  }

  return meiliSearchParams
}
