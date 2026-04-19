import type {
  MultipleQueriesQuery as AlgoliaMultipleQueriesQuery,
  multipleSearchForFacetValues,
} from '@algolia/client-search'
import type { InstantSearchOptions } from 'instantsearch.js/es/lib/InstantSearch.js'
import type {
  MultiSearchQuery as MeilisearchMultiSearchParams,
  MultiSearchResult,
  Config as MeilisearchConfig,
  Meilisearch,
} from 'meilisearch'

// Turns readonly types into mutable ones
export type Mutable<TVal> = { -readonly [TKey in keyof TVal]: TVal[TKey] }

export type { AlgoliaMultipleQueriesQuery, MultiSearchResult }
export type {
  SearchResponse as AlgoliaSearchResponse,
  SearchForFacetValuesResponse as AlgoliaSearchForFacetValuesResponse,
} from '@algolia/client-search'

export type AlgoliaSearchForFacetValuesRequests = Parameters<
  ReturnType<typeof multipleSearchForFacetValues>
>[0]

export type AlgoliaSearchForFacetValuesRequest =
  AlgoliaSearchForFacetValuesRequests[0]

export type {
  Filter,
  FacetDistribution,
  Meilisearch,
  FacetStats as MeiliFacetStats,
  MultiSearchQuery as MeilisearchMultiSearchParams,
  Config as MeilisearchConfig,
} from 'meilisearch'

export type ApiKeyCallback = () => string

export type InstantSearchParams = NonNullable<
  AlgoliaMultipleQueriesQuery['params']
>

type BaseOverridableMeilisearchSearchParameters = Pick<
  MeilisearchMultiSearchParams,
  | 'sort'
  | 'hitsPerPage'
  | 'filter'
  | 'facets'
  | 'attributesToCrop'
  | 'attributesToRetrieve'
  | 'attributesToSearchOn'
  | 'cropLength'
  | 'cropMarker'
  | 'attributesToHighlight'
  | 'distinct'
  | 'highlightPreTag'
  | 'highlightPostTag'
  | 'hybrid'
  | 'matchingStrategy'
  | 'rankingScoreThreshold'
  | 'showMatchesPosition'
  | 'showRankingScore'
  | 'vector'
>

export type OverridableMeilisearchSearchParameters =
  BaseOverridableMeilisearchSearchParameters & {
    indexesOverrides?: Record<
      string,
      BaseOverridableMeilisearchSearchParameters
    >
  }

type BaseInstantMeilisearchOptions = {
  placeholderSearch?: boolean
  primaryKey?: string
  keepZeroFacets?: boolean
  clientAgents?: string[]
  finitePagination?: boolean
  meilisearchParams?: OverridableMeilisearchSearchParameters
}

export type InstantMeilisearchOptions = Pick<
  MeilisearchConfig,
  'requestInit' | 'httpClient'
> &
  BaseInstantMeilisearchOptions

export type InstantMeilisearchConfig = Required<
  Pick<
    InstantMeilisearchOptions,
    'placeholderSearch' | 'keepZeroFacets' | 'clientAgents' | 'finitePagination'
  >
> &
  BaseInstantMeilisearchOptions

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

export type MeilisearchSearchMetadata = {
  queryUid: string
  indexUid: string
  primaryKey?: string
  remote?: string
}

export type MeilisearchMultiSearchResult<T = Record<string, any>> =
  MultiSearchResult<T> & {
    pagination: PaginationState
    metadata?: MeilisearchSearchMetadata
  }

export type MeilisearchSearchResponse<T = Record<string, any>> = Omit<
  import('@algolia/client-search').SearchResponse<T>,
  'hits'
> & {
  hits: Array<T & { __position: number }>
  _meilisearch?: {
    metadata: MeilisearchSearchMetadata
  }
}

export type SearchContext = InstantMeilisearchOptions &
  InstantSearchParams & {
    pagination: PaginationState
    indexUid: string
    sort?: string | string[]
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

export type InstantMeilisearchInstance =
  InstantSearchOptions['searchClient'] & {
    clearCache: () => void
  }

export type InstantMeilisearchObject = {
  meilisearchInstance: Meilisearch
  setMeilisearchParams: (params: OverridableMeilisearchSearchParameters) => void
  searchClient: InstantMeilisearchInstance
}

export type MultiSearchResolver = {
  multiSearch: (
    searchQueries: MeilisearchMultiSearchParams[],
    instantSearchPagination: PaginationState[]
  ) => Promise<MeilisearchMultiSearchResult[]>
}

export type AlgoliaFacetStats = Record<
  string,
  {
    /** The minimum value in the result set. */
    min: number
    /** The maximum value in the result set. */
    max: number
    /** The average facet value in the result set. */
    avg: number
    /** The sum of all values in the result set. */
    sum: number
  }
>
