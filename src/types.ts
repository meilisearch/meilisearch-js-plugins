import { MeiliSearch, SearchParams, SearchResponse } from 'meilisearch'
export * as MeiliSearchTypes from 'meilisearch'

export type AISSearchParams = {
  page?: number
  hitsPerPage?: number
  highlightPreTag?: string
  highlightPostTag?: string
  snippetEllipsisText?: string
  attributesToSnippet?: string[]
  query: string
  facets: string[] // TODO: exclude key facetsDistribution because this one is used instead
} & SearchParams<any>

export type AISSearchRequest = {
  params: AISSearchParams
  indexName: string
}

export type AISSearchRequests = [AISSearchRequest]

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

export type IMResponse<T = Record<string, any>> = {
  results: [
    {
      hits: Array<IMHits<T>>
      index: string
      hitsPerPage: number
      facets?: Record<string, object | undefined>
      exhaustiveFacetsCount?: boolean
      processingTimeMs: number
      exhaustiveNbHits: boolean
      nbPages?: number
      page?: number | undefined
      nbHits: number
      query: string
    }
  ]
}

export type InstantMeiliSearchInstance = {
  pagination?: boolean
  paginationTotalHits: number
  hitsPerPage: number
  client: MeiliSearch
  attributesToHighlight: string[]
  placeholderSearch: boolean

  transformToIMResponse: (
    indexUid: string,
    meiliSearchResponse: SearchResponse<any, any>,
    instantSearchParams: AISSearchParams
  ) => IMResponse

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
  search: (requests: AISSearchRequests) => Promise<IMResponse>
}
