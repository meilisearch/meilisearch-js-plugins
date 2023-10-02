import type {
  SearchContext,
  Filter,
  PaginationState,
  MeiliSearchMultiSearchParams,
  Mutable,
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
  return !(!placeholderSearch && !query && (!filter || filter.length === 0))
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
  const {
    query,
    indexUid,
    facets,
    attributesToSnippet,
    snippetEllipsisText,
    filters,
    numericFilters,
    facetFilters,
    attributesToRetrieve,
    attributesToHighlight,
    highlightPreTag,
    highlightPostTag,
    placeholderSearch,
    pagination,
    sort,
    restrictSearchableAttributes,
    meiliSearchParams: overrideParams,
  } = searchContext
  const meiliSearchParams: MeiliSearchMultiSearchParams = { indexUid }

  const meilisearchFilters = adaptFilters(filters, numericFilters, facetFilters)

  return {
    getParams(): MeiliSearchMultiSearchParams {
      return meiliSearchParams
    },
    addQuery() {
      meiliSearchParams.q = query
    },
    addFacets() {
      const value = <Mutable<typeof facets>>facets
      if (value !== undefined) {
        // despite Instantsearch.js typing it as `string[]`,
        // it still can send `string`
        meiliSearchParams.facets = typeof value === 'string' ? [value] : value
      }
    },
    addAttributesToCrop() {
      const value =
        overrideParams?.attributesToCrop ??
        <Mutable<typeof attributesToSnippet>>attributesToSnippet
      if (value !== undefined) {
        meiliSearchParams.attributesToCrop = value
      }
    },
    addCropLength() {
      const value = overrideParams?.cropLength
      if (value !== undefined) {
        meiliSearchParams.cropLength = value
      }
    },
    addCropMarker() {
      const value = overrideParams?.cropMarker ?? snippetEllipsisText
      if (value !== undefined) {
        meiliSearchParams.cropMarker = value
      }
    },
    addFilters() {
      if (meilisearchFilters.length) {
        meiliSearchParams.filter = meilisearchFilters
      }
    },
    addAttributesToRetrieve() {
      const value =
        overrideParams?.attributesToRetrieve ??
        <Mutable<typeof attributesToRetrieve>>attributesToRetrieve
      if (value !== undefined) {
        meiliSearchParams.attributesToRetrieve = value
      }
    },
    addAttributesToHighlight() {
      meiliSearchParams.attributesToHighlight =
        overrideParams?.attributesToHighlight ??
          <Mutable<typeof attributesToHighlight>>attributesToHighlight ?? ['*']
    },
    addPreTag() {
      meiliSearchParams.highlightPreTag =
        overrideParams?.highlightPreTag ??
        highlightPreTag ??
        '__ais-highlight__'
    },
    addPostTag() {
      meiliSearchParams.highlightPostTag =
        overrideParams?.highlightPostTag ??
        highlightPostTag ??
        '__/ais-highlight__'
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

      if (filter !== undefined) {
        if (Array.isArray(meiliSearchParams.filter)) {
          meiliSearchParams.filter.unshift(filter)
        } else {
          meiliSearchParams.filter = [filter]
        }
      }
    },
    addShowMatchesPosition() {
      const value = overrideParams?.showMatchesPosition
      if (value !== undefined) {
        meiliSearchParams.showMatchesPosition = value
      }
    },
    addMatchingStrategy() {
      const value = overrideParams?.matchingStrategy
      if (value !== undefined) {
        meiliSearchParams.matchingStrategy = value
      }
    },
    addShowRankingScore() {
      const value = overrideParams?.showRankingScore
      if (value !== undefined) {
        meiliSearchParams.showRankingScore = value
      }
    },
    addAttributesToSearchOn() {
      const value =
        overrideParams?.attributesToSearchOn !== undefined
          ? overrideParams.attributesToSearchOn
          : <Mutable<typeof restrictSearchableAttributes>>(
              restrictSearchableAttributes
            )
      if (value !== undefined) {
        meiliSearchParams.attributesToSearchOn = value
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
  meilisearchParams.addFacets()
  meilisearchParams.addAttributesToCrop()
  meilisearchParams.addCropLength()
  meilisearchParams.addCropMarker()
  meilisearchParams.addFilters()
  meilisearchParams.addAttributesToRetrieve()
  meilisearchParams.addAttributesToHighlight()
  meilisearchParams.addPreTag()
  meilisearchParams.addPostTag()
  meilisearchParams.addPagination()
  meilisearchParams.addSort()
  meilisearchParams.addGeoSearchFilter()
  meilisearchParams.addShowMatchesPosition()
  meilisearchParams.addMatchingStrategy()
  meilisearchParams.addShowRankingScore()
  meilisearchParams.addAttributesToSearchOn()

  return meilisearchParams.getParams()
}
