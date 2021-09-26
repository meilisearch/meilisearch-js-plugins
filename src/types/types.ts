import * as MStypes from 'meilisearch'
import * as IStypes from './instantsearch-types'
import { SearchClient } from 'instantsearch.js'
import { SearchOptions } from '@algolia/client-search'

// export type instantSearchResponse =

export declare type RequestOptions = {
  /**
   * If the given request should persist on the cache. Keep in mind,
   * that some methods may have this option enabled by default.
   */
  readonly cacheable?: boolean
  /**
   * Custom timeout for the request. Note that, in normal situacions
   * the given timeout will be applied. But the transporter layer may
   * increase this timeout if there is need for it.
   */
  readonly timeout?: number
  /**
   * Custom headers for the request. This headers are
   * going to be merged the transporter headers.
   */
  readonly headers?: Readonly<Record<string, string>>
  /**
   * Custom query parameters for the request. This query parameters are
   * going to be merged the transporter query parameters.
   */
  readonly queryParameters?: Record<string, any>
  /**
   * Custom data for the request. This data are
   * going to be merged the transporter data.
   */
  readonly data?: Record<string, any>
  /**
   * Additional request body values. It's only taken in
   * consideration in `POST` and `PUT` requests.
   */
  [key: string]: any
}

export type InstantSearchParams =
  | SearchOptions
  | (SearchOptions & { readonly facetQuery?: string | undefined })
  | undefined

export type Cache = {
  [category: string]: string[]
}

export type ParsedFilter = {
  filterName: string
  value: string
}

export type FacetsDistribution = MStypes.FacetsDistribution
export type Filter = string | Array<string | string[]>

export type IMSearchParams = Omit<
  IStypes.SearchParameters,
  'facetFilters' | 'filters'
> & {
  query?: string
  filter?: Filter
}
export type ISSearchParams = Omit<IStypes.SearchParameters, 'facetFilters'> & {
  query?: string
  facetFilters?: Filter
  sort?: string
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
  primaryKey?: string
  client: MStypes.MeiliSearch
  placeholderSearch: boolean
  sort?: string
  query?: string
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

// export type CreateSnippetResult = (
//   snippetsParams: HighLightParams & SnippetsParams & FormattedHit
// ) => { formattedHit: any } & IMSearchParams

export type SnippetValue = (
  value: string,
  snippetEllipsisText?: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) => string

export type AdaptToMeiliSearchParams = (
  instantSearchParams:
    | SearchOptions
    | (SearchOptions & {
        readonly facetQuery?: string | undefined
      })
    | undefined,
  instantMeiliSearchContext: InstantMeiliSearchContext
) => Record<string, any>

export type AdaptToISResponse = (
  indexUid: string,
  meiliSearchResponse: MStypes.SearchResponse<any>,
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

export type InstantMeiliSearchInstance = SearchClient & {
  MeiliSearchClient: MStypes.MeiliSearch
}

// export type InstantMeiliSearchInstance = {
//   MeiliSearchClient: MStypes.MeiliSearch
//   search: (
//     requests: ISSearchRequest[]
//   ) => Promise<{ results: SearchResponse[] }>
// }

export type InstantMeiliSearchClient = (
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions
) => InstantMeiliSearchInstance
