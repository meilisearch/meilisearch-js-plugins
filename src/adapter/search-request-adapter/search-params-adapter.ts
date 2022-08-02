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
function MeiliParamsCreator(searchContext: SearchContext) {
  const meiliSearchParams: Record<string, any> = {}
  const {
    facets,
    attributesToSnippet,
    snippetEllipsisText,
    attributesToRetrieve,
    filters,
    numericFilters,
    facetFilters,
    attributesToHighlight,
    highlightPreTag,
    highlightPostTag,
    placeholderSearch,
    query,
    finitePagination,
    sort,
    pagination,
    optionalWords,
  } = searchContext

  return {
    getParams() {
      return meiliSearchParams
    },
    addFacets() {
      if (facets?.length) {
        meiliSearchParams.facets = facets
      }
    },
    addAttributesToCrop() {
      if (attributesToSnippet) {
        meiliSearchParams.attributesToCrop = attributesToSnippet
      }
    },
    addCropMarker() {
      // Attributes To Crop marker
      if (snippetEllipsisText != null) {
        meiliSearchParams.cropMarker = snippetEllipsisText
      }
    },
    addAttributesToRetrieve() {
      if (attributesToRetrieve) {
        meiliSearchParams.attributesToRetrieve = attributesToRetrieve
      }
    },
    addFilters() {
      const filter = adaptFilters(filters, numericFilters, facetFilters)
      if (filter.length) {
        meiliSearchParams.filter = filter
      }
    },
    addAttributesToHighlight() {
      meiliSearchParams.attributesToHighlight = attributesToHighlight || ['*']
    },
    addPreTag() {
      if (highlightPreTag) {
        meiliSearchParams.highlightPreTag = highlightPreTag
      } else {
        meiliSearchParams.highlightPreTag = '__ais-highlight__'
      }
    },
    addPostTag() {
      if (highlightPostTag) {
        meiliSearchParams.highlightPostTag = highlightPostTag
      } else {
        meiliSearchParams.highlightPostTag = '__/ais-highlight__'
      }
    },
    addPagination() {
      // Limit based on pagination preferences
      if (
        (!placeholderSearch && query === '') ||
        pagination.paginationTotalHits === 0
      ) {
        meiliSearchParams.limit = 0
      } else if (finitePagination) {
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
    addOptionalWords() {
      if (optionalWords) {
        meiliSearchParams.optionalWords = optionalWords
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
  const meilisearchParams = MeiliParamsCreator(searchContext)
  meilisearchParams.addFacets()
  meilisearchParams.addAttributesToHighlight()
  meilisearchParams.addPreTag()
  meilisearchParams.addPostTag()
  meilisearchParams.addAttributesToRetrieve()
  meilisearchParams.addAttributesToCrop()
  meilisearchParams.addCropMarker()
  meilisearchParams.addPagination()
  meilisearchParams.addFilters()
  meilisearchParams.addSort()
  meilisearchParams.addGeoSearchRules()
  meilisearchParams.addOptionalWords()

  return meilisearchParams.getParams()
}
