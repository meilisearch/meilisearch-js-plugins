import * as MStypes from 'meilisearch'
import * as IStypes from './instantsearchTypes'
export * as InstantSearchTypes from './instantsearchTypes'
export * as MeiliSearchTypes from 'meilisearch'

export type ISSearchParams = IStypes.SearchRequestParameters &
  MStypes.SearchParams<any>

export type InstantMeiliSearchOptions = {
  paginationTotalHits?: number
  placeholderSearch?: boolean
  primaryKey?: string
}

export type ISHits<T = Record<string, any>> = T & {
  _highlightResult: Record<
    keyof T,
    {
      value: string
    }
  >
}

export type IMResponse = {
  facets?: Record<string, object | undefined>
  exhaustiveFacetsCount?: boolean
  exhaustiveNbHits: boolean
  nbPages?: number
}

export type SearchResponse = IStypes.SearchResponse & IMResponse

export type instantSearchUtils = {}

export type InstantMeiliSearchInstance = {
  page: number
  paginationTotalHits: number
  hitsPerPage: number
  primaryKey: string | undefined
  client: MStypes.MeiliSearch
  placeholderSearch: boolean

  transformToISResponse: (
    indexUid: string,
    meiliSearchResponse: MStypes.SearchResponse<any, any>,
    instantSearchParams: ISSearchParams
  ) => { results: SearchResponse[] }

  transformToMeiliSearchParams: (
    instantSearchParams: ISSearchParams
  ) => Record<string, any>

  transformToISHits: (
    meiliSearchHits: Array<Record<string, any>>,
    instantSearchParams: ISSearchParams
  ) => ISHits[]
  getNumberPages: (hitsLength: number) => number
  paginateHits: (
    meiliSearchHits: Array<Record<string, any>>
  ) => Array<Record<string, any>>
  search: (
    requests: IStypes.SearchRequest[]
  ) => Promise<{ results: SearchResponse[] }>
}
