import type { MeiliSearch } from 'meilisearch'
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
} from 'meilisearch'

export type InstantSearchParams = AlgoliaMultipleQueriesQuery['params']

export type Cache = {
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

export type SearchContext = {
  page: number
  paginationTotalHits: number
  hitsPerPage: number
  primaryKey?: string
  client: MeiliSearch
  placeholderSearch: boolean
  sort?: string
  query?: string
}

export type AdaptToMeiliSearchParams = (
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: SearchContext
) => Record<string, any>

export type InstantMeiliSearchInstance = SearchClient & {
  MeiliSearchClient: MeiliSearch
}
