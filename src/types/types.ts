import type {
  SearchResponse as MeiliSearchResponse,
  FacetDistribution,
} from 'meilisearch'
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

export type FacetsCache = {
  [category: string]: string[]
}

export type ParsedFilter = {
  filterName: string
  value: string
}

export type InstantMeiliSearchOptions = {
  paginationTotalHits?: number
  placeholderSearch?: boolean
  primaryKey?: string
  keepZeroFacets?: boolean
  finitePagination?: boolean
  clientAgents?: string[]
  optionalWords?: string
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

export type PaginationContext = {
  paginationTotalHits: number
  hitsPerPage: number
  page: number
}

export type PaginationParams = {
  paginationTotalHits?: number
  hitsPerPage?: number
  page?: number
}

export type SearchContext = Omit<
  InstantSearchParams,
  'insideBoundingBox' | 'optionalWords'
> &
  InstantSearchParams & {
    insideBoundingBox?: InsideBoundingBox
    keepZeroFacets?: boolean
    cropMarker?: string
    defaultFacetDistribution: FacetDistribution
    pagination: PaginationContext
    finitePagination: boolean
    sort?: string
    indexUid: string
    placeholderSearch?: boolean
    primaryKey?: string
    optionalWords?: string
  }

export type InstantMeiliSearchInstance = SearchClient & {
  clearCache: () => void
}
