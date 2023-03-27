import type { SearchClient } from 'instantsearch.js'
import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from '@algolia/client-search'

import type {
  SearchParams as MeiliSearchParams,
  SearchResponse as MeiliSearchResponse,
  MultiSearchResponse as MeilisearchMultiSearchResponse,
} from 'meilisearch'

export type {
  AlgoliaMultipleQueriesQuery,
  MeilisearchMultiSearchResponse,
  MeiliSearchParams,
  MeiliSearchResponse,
}
export type { SearchResponse as AlgoliaSearchResponse } from '@algolia/client-search'

export type { Filter, FacetDistribution, MeiliSearch } from 'meilisearch'

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

export type GeoSearchContext = {
  aroundLatLng?: string
  aroundLatLngViaIP?: boolean
  aroundRadius?: number | 'all'
  aroundPrecision?: number
  minimumAroundRadius?: number
  insideBoundingBox?: InsideBoundingBox
  insidePolygon?: ReadonlyArray<readonly number[]>
}

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

export type Facets = string | string[] | undefined

export type MeiliSearchMultiSearchParams = MeiliSearchParams & {
  indexUid: string
}

export type MeilisearchMultiSearchResult<T = Record<string, any>> =
  MeiliSearchResponse<T> & {
    indexUid: string
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
    sort?: string
    primaryKey?: string
    matchingStrategy?: MatchingStrategies
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
