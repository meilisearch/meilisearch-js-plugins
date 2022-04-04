import type { MeiliSearchParams, SearchContext } from '../../types'

import {
  adaptGeoPointsRules,
  createGeoSearchContext,
} from './geo-rules-adapter'
import { adaptFilters } from './filter-adapter'

/**
 * Adapts instantsearch.js and instant-meilisearch options
 * to meilisearch search query parameters.
 *
 * @param  {SearchContext} searchContext
 *
 * @returns {MeiliSearchParams}
 */
function ParamsAdapter(searchContext: SearchContext) {
  const meiliSearchParams: Record<string, any> = {}

  return {
    getParams() {
      return meiliSearchParams
    },
    adaptFacets() {
      const facets = searchContext?.facets
      if (facets?.length) {
        meiliSearchParams.facetsDistribution = facets
      }
    },
    adaptAttributesToCrop() {
      const attributesToCrop = searchContext?.attributesToSnippet
      if (attributesToCrop) {
        meiliSearchParams.attributesToCrop = attributesToCrop
      }
    },
    adaptAttributesToRetrieve() {
      const attributesToRetrieve = searchContext?.attributesToRetrieve
      if (attributesToRetrieve) {
        meiliSearchParams.attributesToRetrieve = attributesToRetrieve
      }
    },
    adaptFilters() {
      const filter = adaptFilters(
        searchContext?.filters,
        searchContext?.numericFilters,
        searchContext?.facetFilters
      )
      if (filter.length) {
        meiliSearchParams.filter = filter
      }
    },
    adaptAttributesToHighlight() {
      meiliSearchParams.attributesToHighlight = searchContext?.attributesToHighlight || [
        '*',
      ]
    },
    adaptLimit() {
      const placeholderSearch = searchContext.placeholderSearch
      const query = searchContext.query
      const { pagination } = searchContext

      // Limit based on pagination preferences
      if (
        (!placeholderSearch && query === '') ||
        pagination.paginationTotalHits === 0
      ) {
        meiliSearchParams.limit = 0
      } else if (searchContext.finitePagination) {
        meiliSearchParams.limit = pagination.paginationTotalHits
      } else {
        const limit = (pagination.page + 1) * pagination.hitsPerPage + 1
        // If the limit is bigger than the total hits accepted
        // force the limit to that amount
        if (limit > pagination.paginationTotalHits) {
          meiliSearchParams.limit = pagination.paginationTotalHits
        } else {
          meiliSearchParams.limit = limit
        }
      }
    },
    adaptSort() {
      const sort = searchContext.sort

      if (sort?.length) {
        meiliSearchParams.sort = [sort]
      }
    },
    adaptGeoSearchRules() {
      const geoSearchContext = createGeoSearchContext(searchContext)
      const geoRules = adaptGeoPointsRules(geoSearchContext)

      if (geoRules?.filter) {
        if (meiliSearchParams.filter) {
          meiliSearchParams.filter.unshift(geoRules.filter)
        } else {
          meiliSearchParams.filter = [geoRules.filter]
        }
      }
    },
  }
}

/**
 * Adapt search request from instantsearch.js
 * to search request compliant with Meilisearch
 *
 * @param  {SearchContext} searchContext
 * @returns {MeiliSearchParams}
 */
export function adaptSearchParams(
  searchContext: SearchContext
): MeiliSearchParams {
  const adapter = ParamsAdapter(searchContext)
  adapter.adaptFacets()
  adapter.adaptFilters()
  adapter.adaptLimit()
  adapter.adaptSort()
  adapter.adaptGeoSearchRules()
  adapter.adaptAttributesToCrop()
  adapter.adaptAttributesToHighlight()
  adapter.adaptAttributesToRetrieve()

  return adapter.getParams()
}
