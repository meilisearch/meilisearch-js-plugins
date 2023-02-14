import type { SearchResponse as MeiliSearchResponse } from 'meilisearch'
import type { SearchClient } from 'instantsearch.js'
import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from '@algolia/client-search'

export type { AlgoliaMultipleQueriesQuery }
export type { SearchResponse as AlgoliaSearchResponse } from '@algolia/client-search'

export type {
  Filter,
  FacetDistribution,
  SearchResponse as MeiliSearchResponse,
  SearchParams as MeiliSearchParams,
  MeiliSearch,
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

export type SearchCacheInterface = {
  getEntry: (key: string) => MeiliSearchResponse | undefined
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
