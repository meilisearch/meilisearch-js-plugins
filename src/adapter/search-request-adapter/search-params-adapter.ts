import type { MeiliSearchParams, SearchContext } from '../../types'

import {
  adaptGeoPointsRules,
  createGeoSearchContext,
} from './geo-rules-adapter'
import { adaptFilters } from './filter-adapter'

function setScrollPagination(
  hitsPerPage: number,
  page: number,
  query?: string,
  placeholderSearch?: boolean
): { limit: number; offset: number } {
  if (!placeholderSearch && query === '') {
    return {
      limit: 0,
      offset: 0,
    }
  }

  return {
    limit: hitsPerPage + 1,
    offset: page * hitsPerPage,
  }
}

function setFinitePagination(
  hitsPerPage: number,
  page: number,
  query?: string,
  placeholderSearch?: boolean
): { hitsPerPage: number; page: number } {
  if (!placeholderSearch && query === '') {
    return {
      hitsPerPage: 0,
      page: page + 1,
    }
  } else {
    return {
      hitsPerPage: hitsPerPage,
      page: page + 1,
    }
  }
}
/**
 * Adapts instantsearch.js and instant-meilisearch options
 * to meilisearch search query parameters.
 *
 * @param  {SearchContext} searchContext
 *
 * @returns {MeiliSearchParams}
 */
export function MeiliParamsCreator(searchContext: SearchContext) {
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
    sort,
    pagination,
    matchingStrategy,
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
      if (pagination.finite) {
        const { hitsPerPage, page } = setFinitePagination(
          pagination.hitsPerPage,
          pagination.page,
          query,
          placeholderSearch
        )
        meiliSearchParams.hitsPerPage = hitsPerPage
        meiliSearchParams.page = page
      } else {
        const { limit, offset } = setScrollPagination(
          pagination.hitsPerPage,
          pagination.page,
          query,
          placeholderSearch
        )
        meiliSearchParams.limit = limit
        meiliSearchParams.offset = offset
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
    addMatchingStrategy() {
      if (matchingStrategy) {
        meiliSearchParams.matchingStrategy = matchingStrategy
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
  meilisearchParams.addMatchingStrategy()

  return meilisearchParams.getParams()
}
