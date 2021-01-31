import { MeiliSearch, SearchParams, SearchResponse, Hit } from 'meilisearch'
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
  instantSearchParams: AISSearchParams
  indexName: string
}

export type AISSearchRequests = [AISSearchRequest]

export type InstantMeiliSearchOptions = {
  paginationTotalHits?: number
  placeholderSearch?: boolean
}

export type IMResponse = {
  results: [
    {
      hits: any
      index: string
      hitsPerPage: number
      facets: object | undefined
      exhaustiveFacetsCount?: boolean
      processingTimeMs: number
      exhaustiveNbHits: boolean
    }
  ]
}

export type InstantMeiliSearchInstance = {
  pagination?: boolean
  paginationTotalHits: number
  hitsPerPage?: number
  client: MeiliSearch
  attributesToHighlight: string[]
  placeholderSearch: boolean
  parseMeiliSearchResponse: <T, P extends SearchParams<T>>(
    indexUid: string,
    meiliSearchResponse: SearchResponse<T, P>,
    instantSearchParams: AISSearchParams
  ) => IMResponse

  transformToMeiliSearchParams: (
    instantSearchParams: AISSearchParams
  ) => {
    q: any
    facetsDistribution: any
    facetFilters: any
    attributesToHighlight: string[]
    attributesToCrop: string[] | undefined
    filters: any
    limit: number
  }
  parseHits: (meiliSearchHits: any, params: AISSearchParams) => MeiliSearchTypes.Hits<T>
  paginationParams: (
    hitsLength: number,
    instantSearchParams: AISSearchParams
  ) => { nbPages: number; page: number | undefined } | undefined

  search: (requests: AISSearchRequests) => Promise<IMResponse>
}
