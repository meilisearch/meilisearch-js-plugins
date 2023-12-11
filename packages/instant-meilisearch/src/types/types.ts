import type { SearchClient } from 'instantsearch.js'
import type {
  MultipleQueriesQuery as AlgoliaMultipleQueriesQuery,
  multipleSearchForFacetValues,
} from '@algolia/client-search'
import type {
  MultiSearchQuery as MeiliSearchMultiSearchParams,
  MultiSearchResult,
  Config as MeilisearchConfig,
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
  MeiliSearch,
  FacetStats as MeiliFacetStats,
  MultiSearchQuery as MeiliSearchMultiSearchParams,
  Config as MeilisearchConfig,
} from 'meilisearch'

export type ApiKeyCallback = () => string

export type InstantSearchParams = NonNullable<
  AlgoliaMultipleQueriesQuery['params']
>

export type OverridableMeiliSearchSearchParameters = Pick<
  MeiliSearchMultiSearchParams,
  | 'attributesToRetrieve'
  | 'attributesToCrop'
  | 'cropLength'
  | 'cropMarker'
  | 'attributesToHighlight'
  | 'highlightPreTag'
  | 'highlightPostTag'
  | 'showMatchesPosition'
  | 'matchingStrategy'
  | 'showRankingScore'
  | 'attributesToSearchOn'
>

type BaseInstantMeiliSearchOptions = {
  placeholderSearch?: boolean
  primaryKey?: string
  keepZeroFacets?: boolean
  clientAgents?: string[]
  finitePagination?: boolean
  meiliSearchParams?: OverridableMeiliSearchSearchParameters
}

export type InstantMeiliSearchOptions = Pick<
  MeilisearchConfig,
  'requestConfig' | 'httpClient'
> &
  BaseInstantMeiliSearchOptions

export type InstantMeiliSearchConfig = Required<
  Pick<
    InstantMeiliSearchOptions,
    'placeholderSearch' | 'keepZeroFacets' | 'clientAgents' | 'finitePagination'
  >
> &
  BaseInstantMeiliSearchOptions

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

export type SearchContext = InstantMeiliSearchOptions &
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

export type InstantMeiliSearchInstance = SearchClient & {
  clearCache: () => void
}

export type InstantMeiliSearchObject = {
  setMeiliSearchParams: (params: OverridableMeiliSearchSearchParameters) => void
  searchClient: InstantMeiliSearchInstance
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
