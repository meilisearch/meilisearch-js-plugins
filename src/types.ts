import * as MStypes from 'meilisearch'
import * as IStypes from './instantsearchTypes'
export * as InstantsearchTypes from './instantsearchTypes'
export * as MeiliSearchTypes from 'meilisearch'

export type AISSearchParams = IStypes.SearchRequestParameters &
  MStypes.SearchParams<any>

export type InstantMeiliSearchOptions = {
  paginationTotalHits?: number
  placeholderSearch?: boolean
}

export type IMHits<T = Record<string, any>> = T & {
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

export type InstantMeiliSearchInstance = {
  pagination?: boolean
  paginationTotalHits: number
  hitsPerPage: number
  client: MStypes.MeiliSearch
  attributesToHighlight: string[]
  placeholderSearch: boolean

  transformToIMResponse: (
    indexUid: string,
    meiliSearchResponse: MStypes.SearchResponse<any, any>,
    instantSearchParams: AISSearchParams
  ) => { results: SearchResponse[] }

  transformToMeiliSearchParams: (
    instantSearchParams: AISSearchParams
  ) => Record<string, any>

  transformToIMHits: (
    meiliSearchHits: Array<Record<string, any>>,
    instantSearchParams: AISSearchParams
  ) => IMHits[]
  paginationParams: (
    hitsLength: number,
    instantSearchParams: AISSearchParams
  ) => { nbPages: number; page: number | undefined } | undefined
  paginateIMHits: (
    { page }: AISSearchParams,
    meiliSearchHits: Array<Record<string, any>>
  ) => Array<Record<string, any>>
  search: (
    requests: IStypes.SearchRequest[]
  ) => Promise<{ results: SearchResponse[] }>
}
