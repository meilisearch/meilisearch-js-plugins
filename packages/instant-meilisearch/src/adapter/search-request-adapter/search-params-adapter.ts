import type {
  SearchContext,
  Filter,
  PaginationState,
  MeilisearchMultiSearchParams,
  Mutable,
} from '../../types/index.js'

import { adaptGeoSearch } from './geo-rules-adapter.js'
import { adaptFilters } from './filter-adapter.js'

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
 * Adapts instantsearch.js and instant-meilisearch options to meilisearch search
 * query parameters.
 *
 * @param {SearchContext} searchContext
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
    meilisearchParams: overrideParams,
  } = searchContext
  const meilisearchParams: MeilisearchMultiSearchParams = { indexUid }

  const meilisearchFilters = adaptFilters(filters, numericFilters, facetFilters)

  return {
    getParams(): MeilisearchMultiSearchParams {
      return meilisearchParams
    },
    addQuery() {
      meilisearchParams.q = query
    },
    addFacets() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.facets ??
        overrideParams?.facets ??
        <Mutable<typeof facets>>facets
      if (value !== undefined) {
        // despite Instantsearch.js typing it as `string[]`,
        // it still can send `string`
        meilisearchParams.facets = typeof value === 'string' ? [value] : value
      }
    },
    addAttributesToCrop() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.attributesToCrop ??
        overrideParams?.attributesToCrop ??
        <Mutable<typeof attributesToSnippet>>attributesToSnippet
      if (value !== undefined) {
        meilisearchParams.attributesToCrop = value
      }
    },
    addCropLength() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.cropLength ??
        overrideParams?.cropLength
      if (value !== undefined) {
        meilisearchParams.cropLength = value
      }
    },
    addCropMarker() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.cropMarker ??
        overrideParams?.cropMarker ??
        snippetEllipsisText
      if (value !== undefined) {
        meilisearchParams.cropMarker = value
      }
    },
    addFilters() {
      const overrideFilter =
        overrideParams?.indexesOverrides?.[indexUid]?.filter ??
        overrideParams?.filter

      if (overrideFilter !== undefined) {
        meilisearchParams.filter = overrideFilter
      } else if (meilisearchFilters.length) {
        meilisearchParams.filter = meilisearchFilters
      }
    },
    addAttributesToRetrieve() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.attributesToRetrieve ??
        overrideParams?.attributesToRetrieve ??
        <Mutable<typeof attributesToRetrieve>>attributesToRetrieve
      if (value !== undefined) {
        meilisearchParams.attributesToRetrieve = value
      }
    },
    addAttributesToHighlight() {
      meilisearchParams.attributesToHighlight = overrideParams
        ?.indexesOverrides?.[indexUid]?.attributesToHighlight ??
        overrideParams?.attributesToHighlight ??
        <Mutable<typeof attributesToHighlight>>attributesToHighlight ?? ['*']
    },
    addPreTag() {
      meilisearchParams.highlightPreTag =
        overrideParams?.indexesOverrides?.[indexUid]?.highlightPreTag ??
        overrideParams?.highlightPreTag ??
        highlightPreTag ??
        '__ais-highlight__'
    },
    addPostTag() {
      meilisearchParams.highlightPostTag =
        overrideParams?.indexesOverrides?.[indexUid]?.highlightPostTag ??
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
        meilisearchParams.hitsPerPage = hitsPerPage
        meilisearchParams.page = page
      } else {
        const { limit, offset } = setScrollPagination(
          pagination,
          paginationRequired
        )
        meilisearchParams.limit = limit
        meilisearchParams.offset = offset
      }
    },
    addSort() {
      const overrideSort =
        overrideParams?.indexesOverrides?.[indexUid]?.sort ??
        overrideParams?.sort

      const value = overrideSort ?? sort
      if (value && (Array.isArray(value) ? value.length : true)) {
        meilisearchParams.sort = Array.isArray(value) ? value : [value]
      }
    },
    addGeoSearchFilter() {
      const {
        insidePolygon,
        insideBoundingBox,
        aroundLatLng,
        aroundRadius,
        minimumAroundRadius,
      } = searchContext

      const filter = adaptGeoSearch({
        insidePolygon,
        insideBoundingBox,
        aroundLatLng,
        aroundRadius,
        minimumAroundRadius,
      })

      if (filter !== undefined) {
        if (Array.isArray(meilisearchParams.filter)) {
          meilisearchParams.filter.unshift(filter)
        } else {
          meilisearchParams.filter = [filter]
        }
      }
    },
    addShowMatchesPosition() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.showMatchesPosition ??
        overrideParams?.showMatchesPosition
      if (value !== undefined) {
        meilisearchParams.showMatchesPosition = value
      }
    },
    addMatchingStrategy() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.matchingStrategy ??
        overrideParams?.matchingStrategy
      if (value !== undefined) {
        meilisearchParams.matchingStrategy = value
      }
    },
    addShowRankingScore() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.showRankingScore ??
        overrideParams?.showRankingScore
      if (value !== undefined) {
        meilisearchParams.showRankingScore = value
      }
    },
    addAttributesToSearchOn() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.attributesToSearchOn ??
        overrideParams?.attributesToSearchOn ??
        <Mutable<typeof restrictSearchableAttributes>>(
          restrictSearchableAttributes
        )

      if (value !== undefined) {
        meilisearchParams.attributesToSearchOn = value
      }
    },
    addHybridSearch() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.hybrid ??
        overrideParams?.hybrid
      if (value !== undefined) {
        meilisearchParams.hybrid = value
      }
    },
    addVector() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.vector ??
        overrideParams?.vector
      if (value !== undefined) {
        meilisearchParams.vector = value
      }
    },
    addDistinct() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.distinct ??
        overrideParams?.distinct
      if (value !== undefined) {
        meilisearchParams.distinct = value
      }
    },
    addRankingScoreThreshold() {
      const value =
        overrideParams?.indexesOverrides?.[indexUid]?.rankingScoreThreshold ??
        overrideParams?.rankingScoreThreshold
      if (value !== undefined) {
        meilisearchParams.rankingScoreThreshold = value
      }
    },
  }
}

/**
 * Adapt search request from instantsearch.js to search request compliant with
 * Meilisearch
 *
 * @param {SearchContext} searchContext
 * @returns {MeilisearchMultiSearchParams}
 */
export function adaptSearchParams(
  searchContext: SearchContext
): MeilisearchMultiSearchParams {
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
  meilisearchParams.addHybridSearch()
  meilisearchParams.addVector()
  meilisearchParams.addDistinct()
  meilisearchParams.addRankingScoreThreshold()

  return meilisearchParams.getParams()
}
