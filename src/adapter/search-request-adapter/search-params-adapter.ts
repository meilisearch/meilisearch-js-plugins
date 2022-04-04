import type { MeiliSearchParams, SearchContext } from '../../types'

import {
  adaptGeoPointsRules,
  createGeoSearchContext,
} from './geo-rules-adapter'
import { adaptFilters } from './filter-adapter'

/**
 * Builder to creates an object containing all the search query parameters
 * provided by the search context of instantsearch.js and instant-meilisearch.
 *
 * @param  {SearchContext} searchContext
 *
 * @returns {MeiliSearchParams}
 */
function ParamsBuilder(searchContext: SearchContext) {
  const meiliSearchParams: Record<string, any> = {}

  return {
    getParams() {
      return meiliSearchParams
    },
    addFacets() {
      const facets = searchContext?.facets
      if (facets?.length) {
        meiliSearchParams.facetsDistribution = facets
      }
    },
    addAttributesToCrop() {
      const attributesToCrop = searchContext?.attributesToSnippet
      if (attributesToCrop) {
        meiliSearchParams.attributesToCrop = attributesToCrop
      }
    },
    addAttributesToRetrieve() {
      const attributesToRetrieve = searchContext?.attributesToRetrieve
      if (attributesToRetrieve) {
        meiliSearchParams.attributesToRetrieve = attributesToRetrieve
      }
    },
    addFilters() {
      const filter = adaptFilters(
        searchContext?.filters,
        searchContext?.numericFilters,
        searchContext?.facetFilters
      )
      if (filter.length) {
        meiliSearchParams.filter = filter
      }
    },
    addAttributesToHighlight() {
      meiliSearchParams.attributesToHighlight = searchContext?.attributesToHighlight || [
        '*',
      ]
    },
    addLimit() {
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
    addSort() {
      const sort = searchContext.sort

      if (sort?.length) {
        meiliSearchParams.sort = [sort]
      }
    },
    addGeoSearchRules() {
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
  const buildParams = ParamsBuilder(searchContext)
  buildParams.addFacets()
  buildParams.addFilters()
  buildParams.addLimit()
  buildParams.addSort()
  buildParams.addGeoSearchRules()
  buildParams.addAttributesToCrop()
  buildParams.addAttributesToHighlight()
  buildParams.addAttributesToRetrieve()

  return buildParams.getParams()
}
