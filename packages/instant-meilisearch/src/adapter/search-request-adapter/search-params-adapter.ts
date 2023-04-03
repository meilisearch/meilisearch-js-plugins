import type {
  SearchContext,
  Filter,
  PaginationState,
  MeiliSearchMultiSearchParams,
} from '../../types'

import { adaptGeoSearch } from './geo-rules-adapter'
import { adaptFilters } from './filter-adapter'

function isPaginationRequired(
  filter: Filter,
  query?: string,
  placeholderSearch?: boolean
): boolean {
  // To disable pagination:
  // placeholderSearch must be disabled
  // The search query must be empty
  // There must be no filters
  if (!placeholderSearch && !query && (!filter || filter.length === 0)) {
    return false
  }
  return true
}

function setScrollPagination(
  pagination: PaginationState,
  paginationRequired: boolean
): { limit: number; offset: number } {
  const { page, hitsPerPage } = pagination

  if (!paginationRequired) {
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
  pagination: PaginationState,
  paginationRequired: boolean
): { hitsPerPage: number; page: number } {
  const { page, hitsPerPage } = pagination

  if (!paginationRequired) {
    return {
      hitsPerPage: 0,
      page: page + 1,
    }
  } else {
    return {
      hitsPerPage,
      page: page + 1,
    }
  }
}
/**
 * Adapts instantsearch.js and instant-meilisearch options
 * to meilisearch search query parameters.
 *
 * @param  {SearchContext} searchContext
 */
export function MeiliParamsCreator(searchContext: SearchContext) {
  const meiliSearchParams: any = {}
  const {
    facets,
    attributesToSnippet,
    snippetEllipsisText,
    attributesToRetrieve,
    attributesToHighlight,
    highlightPreTag,
    highlightPostTag,
    placeholderSearch,
    query,
    sort,
    pagination,
    matchingStrategy,
    filters,
    numericFilters,
    facetFilters,
    indexUid,
  } = searchContext

  const meilisearchFilters = adaptFilters(filters, numericFilters, facetFilters)

  return {
    getParams(): MeiliSearchMultiSearchParams {
      return meiliSearchParams
    },
    addQuery() {
      meiliSearchParams.q = query
    },
    addIndexUid() {
      meiliSearchParams.indexUid = indexUid
    },
    addFacets() {
      if (Array.isArray(facets)) {
        meiliSearchParams.facets = facets
      } else if (typeof facets === 'string') {
        meiliSearchParams.facets = [facets]
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
      if (meilisearchFilters.length) {
        meiliSearchParams.filter = meilisearchFilters
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
      const paginationRequired = isPaginationRequired(
        meilisearchFilters,
        query,
        placeholderSearch
      )
      if (pagination.finite) {
        const { hitsPerPage, page } = setFinitePagination(
          pagination,
          paginationRequired
        )
        meiliSearchParams.hitsPerPage = hitsPerPage
        meiliSearchParams.page = page
      } else {
        const { limit, offset } = setScrollPagination(
          pagination,
          paginationRequired
        )
        meiliSearchParams.limit = limit
        meiliSearchParams.offset = offset
      }
    },
    addSort() {
      if (sort?.length) {
        meiliSearchParams.sort = Array.isArray(sort) ? sort : [sort]
      }
    },
    addGeoSearchFilter() {
      const {
        insideBoundingBox,
        aroundLatLng,
        aroundRadius,
        minimumAroundRadius,
      } = searchContext

      const filter = adaptGeoSearch({
        insideBoundingBox,
        aroundLatLng,
        aroundRadius,
        minimumAroundRadius,
      })

      if (filter) {
        if (meiliSearchParams.filter) {
          meiliSearchParams.filter.unshift(filter)
        } else {
          meiliSearchParams.filter = [filter]
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
 * @returns {MeiliSearchMultiSearchParams}
 */
export function adaptSearchParams(
  searchContext: SearchContext
): MeiliSearchMultiSearchParams {
  const meilisearchParams = MeiliParamsCreator(searchContext)
  meilisearchParams.addQuery()
  meilisearchParams.addIndexUid()
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
  meilisearchParams.addGeoSearchFilter()
  meilisearchParams.addMatchingStrategy()

  return meilisearchParams.getParams()
}
