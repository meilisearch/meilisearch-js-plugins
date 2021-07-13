import * as MStypes from 'meilisearch'
import * as IStypes from './instantsearch-types'

export type FacetsDistribution = MStypes.FacetsDistribution
export type SubFilter = string | string[] | undefined | [] | MStypes.Filter
export type Filter = SubFilter | Array<Filter | Filter[]>

export type IMSearchParams = Omit<IStypes.SearchParameters, 'facetFilters'> & {
  query?: string
  facetFilters?: Filter
}
export type ISSearchParams = Omit<IStypes.SearchParameters, 'facetFilters'> & {
  query?: string
  facetFilters?: Filter
}

export type ISSearchRequest = {
  indexName: string
  params: ISSearchParams
}

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
  facets?: Record<string, Record<string, number> | undefined>
  exhaustiveFacetsCount?: boolean
  exhaustiveNbHits: boolean
  nbPages?: number
}

export type SearchResponse = Omit<IStypes.SearchResponse, 'hits'> &
  IStypes.SearchResponse &
  IMResponse & {
    hits: ISHits[]
  }

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
) => { formattedHit: any } & IMSearchParams

export type ReplaceHighlightTags = (
  value: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) => string

export type CreateSnippetResult = (
  snippetsParams: HighLightParams & SnippetsParams & FormattedHit
) => { formattedHit: any } & IMSearchParams

export type SnippetValue = (
  value: string,
  snippetEllipsisText?: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) => string

export type AdaptToMeiliSearchParams = (
  instantSearchParams: ISSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => Record<string, any>

export type AdaptToISResponse = (
  indexUid: string,
  meiliSearchResponse: MStypes.SearchResponse<any, any>,
  instantSearchParams: IMSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => { results: SearchResponse[] }

export type AdaptToISHitsm = (
  meiliSearchHits: Array<Record<string, any>>,
  instantSearchParams: IMSearchParams,
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
    requests: ISSearchRequest[]
  ) => Promise<{ results: SearchResponse[] }>
}

export type InstantMeiliSearchClient = (
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions
) => InstantMeiliSearchInstance
