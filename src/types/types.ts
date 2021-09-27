import type {
  MeiliSearch,
  SearchResponse as MeiliSearchResponse,
} from 'meilisearch'
import type { SearchClient } from 'instantsearch.js'
import type {
  SearchOptions as AlgoliaSearchOptions,
  MultipleQueriesQuery as AlgoliaMultipleQueriesQuery,
} from '@algolia/client-search'

export type { AlgoliaMultipleQueriesQuery, AlgoliaSearchOptions }
export type { SearchResponse as AlgoliaSearchResponse } from '@algolia/client-search'
export type {
  Filter,
  FacetsDistribution,
  SearchResponse as MeiliSearchResponse,
  SearchParams as MeiliSearchParams,
  MeiliSearch,
} from 'meilisearch'

export type InstantSearchParams = AlgoliaMultipleQueriesQuery['params']

export type FilterCache = {
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
}

export type ResponseCacher = {
  getCachedValue: (key: string) => MeiliSearchResponse | undefined
  createKey: (components: any[]) => string
  populate: (searchResponse: MeiliSearchResponse, key: string) => void
}

export type SearchContext = {
  page: number
  paginationTotalHits: number
  hitsPerPage: number
  primaryKey?: string
  placeholderSearch: boolean
  sort?: string
  query?: string
  indexUid: string
}

export type AdaptToMeiliSearchParams = (
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: SearchContext
) => Record<string, any>

export type InstantMeiliSearchInstance = SearchClient & {
  MeiliSearchClient: MeiliSearch
}
