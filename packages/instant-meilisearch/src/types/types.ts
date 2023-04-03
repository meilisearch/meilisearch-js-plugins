import type { SearchClient } from 'instantsearch.js'
import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from '@algolia/client-search'

import type {
  MultiSearchQuery as MeiliSearchMultiSearchParams,
  MultiSearchResult,
} from 'meilisearch'

export type { AlgoliaMultipleQueriesQuery, MultiSearchResult }
export type { SearchResponse as AlgoliaSearchResponse } from '@algolia/client-search'

export type {
  Filter,
  FacetDistribution,
  MeiliSearch,
  FacetStats as MeiliFacetStats,
  MultiSearchQuery as MeiliSearchMultiSearchParams,
} from 'meilisearch'

export type InstantSearchParams = AlgoliaMultipleQueriesQuery['params']

export const enum MatchingStrategies {
  ALL = 'all',
  LAST = 'last',
}

export type InstantMeiliSearchOptions = {
  placeholderSearch?: boolean
  primaryKey?: string
  keepZeroFacets?: boolean
  clientAgents?: string[]
  matchingStrategy?: MatchingStrategies
  finitePagination?: boolean
}

export type InstantMeiliSearchConfig = {
  placeholderSearch: boolean
  keepZeroFacets: boolean
  clientAgents: string[]
  finitePagination: boolean
  primaryKey?: string
  matchingStrategy?: MatchingStrategies
}

export type SearchCacheInterface = {
  getEntry: <T>(key: string) => T | undefined
  formatKey: (components: any[]) => string
  setEntry: <T>(key: string, searchResponse: T) => void
  clearCache: () => void
}

export type InsideBoundingBox = string | ReadonlyArray<readonly number[]>

// Current state of the pagination
export type PaginationState = {
  finite: boolean
  hitsPerPage: number
  page: number
}

export type InstantSearchPagination = {
  hitsPerPage: number
  page: number
  nbPages: number
}

export type MeilisearchMultiSearchResult<T = Record<string, any>> =
  MultiSearchResult<T> & {
    pagination: PaginationState
  }

export type SearchContext = Omit<InstantSearchParams, 'insideBoundingBox'> &
  InstantSearchParams & {
    pagination: PaginationState
    indexUid: string
    placeholderSearch: boolean
    keepZeroFacets: boolean
    insideBoundingBox?: InsideBoundingBox
    cropMarker?: string
    sort?: string | string[]
    primaryKey?: string
    matchingStrategy?: MatchingStrategies
  }

export type InstantSearchGeoParams = {
  aroundLatLng?: string
  aroundLatLngViaIP?: boolean
  aroundRadius?: number | 'all'
  aroundPrecision?: number
  minimumAroundRadius?: number
  insideBoundingBox?: InsideBoundingBox
  insidePolygon?: ReadonlyArray<readonly number[]>
}

export type InstantMeiliSearchInstance = SearchClient & {
  clearCache: () => void
}

export type MultiSearchResolver = {
  multiSearch: (
    searchQueries: MeiliSearchMultiSearchParams[],
    instantSearchPagination: PaginationState[]
  ) => Promise<MeilisearchMultiSearchResult[]>
}

export type AlgoliaFacetStats = Record<
  string,
  {
    /**
     * The minimum value in the result set.
     */
    min: number
    /**
     * The maximum value in the result set.
     */
    max: number
    /**
     * The average facet value in the result set.
     */
    avg: number
    /**
     * The sum of all values in the result set.
     */
    sum: number
  }
>
