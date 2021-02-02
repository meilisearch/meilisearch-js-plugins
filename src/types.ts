import { MeiliSearch, SearchParams, SearchResponse, Hits } from 'meilisearch3'
export * as MeiliSearchTypes from 'meilisearch3'

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
      hits: Array<Record<string, Record<string, string>>>
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
  transformToIMResponse: (
    indexUid: string,
    meiliSearchResponse: SearchResponse,
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
  transformToIMHits: (
    meiliSearchHits: Hits,
    instantSearchParams: AISSearchParams
  ) => Hits
  paginationParams: (
    hitsLength: number,
    instantSearchParams: AISSearchParams
  ) => { nbPages: number; page: number | undefined } | undefined
  paginateIMHits: ({ page }: AISSearchParams, meiliSearchHits: Hits) => Hits
  search: (requests: AISSearchRequests) => Promise<IMResponse>
}
