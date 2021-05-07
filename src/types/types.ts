import * as MStypes from 'meilisearch'
import * as IStypes from './instantsearch-types'

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

export type InstantMeiliSearchContext = {
  page: number
  paginationTotalHits: number
  hitsPerPage: number
  primaryKey: string | undefined
  client: MStypes.MeiliSearch
  placeholderSearch: boolean
}

export type FormattedHit = {
  formattedHit: any
}

export type HighLightParams = {
  formattedHit: any
  highlightPreTag?: string
  highlightPostTag?: string
}

export type SnippetsParams = {
  snippetEllipsisText?: string
  attributesToSnippet?: string[]
}

export type CreateHighlighResult = (
  highLightParams: HighLightParams & FormattedHit
) => { formattedHit: any } & ISSearchParams

export type ReplaceHighlightTags = (
  value: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) => string

export type MergeFiltersAndNumericFilters = (
  filters?: string,
  numericFilters?: string[]
) => string

export type CreateSnippetResult = (
  snippetsParams: HighLightParams & SnippetsParams & FormattedHit
) => { formattedHit: any } & ISSearchParams

export type SnippetValue = (
  value: string,
  snippetEllipsisText?: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) => string

export type TransformToMeiliSearchParams = (
  instantSearchParams: ISSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => Record<string, any>

export type TransformToISResponse = (
  indexUid: string,
  meiliSearchResponse: MStypes.SearchResponse<any, any>,
  instantSearchParams: ISSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => { results: SearchResponse[] }

export type TransformToISHitsm = (
  meiliSearchHits: Array<Record<string, any>>,
  instantSearchParams: ISSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => ISHits[]

export type GetNumberPages = (
  hitsLength: number,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => number

export type PaginateHits = (
  meiliSearchHits: Array<Record<string, any>>,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => Array<Record<string, any>>

export type InstantMeiliSearchInstance = {
  MeiliSearchClient: MStypes.MeiliSearch
  search: (
    requests: IStypes.SearchRequest[]
  ) => Promise<{ results: SearchResponse[] }>
}

export type InstantMeiliSearchClient = (
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions
) => InstantMeiliSearchInstance
