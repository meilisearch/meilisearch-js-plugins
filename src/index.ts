import MeiliSearch, { SearchParams, SearchResponse } from 'meilisearch'

import { createHighlighResult, createSnippetResult } from './format'
import { removeUndefinedFromObject } from './utils'

export type Params = {
  page?: number
  hitsPerPage?: number
  highlightPreTag?: string
  highlightPostTag?: string
  snippetEllipsisText?: string
  attributesToSnippet?: string[]
  query: string
  facets: string[] // TODO: exclude key facetsDistribution because this one is used instead
} & SearchParams<any>

type Request = {
  params: Params
  indexName: string
}
type Requests = {
  0: Request
}
type InstantMeiliSearchOptions = {
  paginationTotalHits?: number
  placeholderSearch?: boolean
}

type InstantMeiliSearchInstance = {
  pagination?: boolean
  paginationTotalHits: number
  hitsPerPage?: number
  client: MeiliSearch
  attributesToHighlight: string[]
  placeholderSearch: boolean
  parseMeiliSearchResponse: (
    indexUid: string,
    meiliSearchResponse: SearchResponse<any, any>,
    params: Params
  ) => {
    results: Array<{
      hits: any
      index: string
      hitsPerPage: number
      facets: object | undefined
      exhaustiveFacetsCount?: boolean
      processingTimeMs: number
      exhaustiveNbHits: boolean
    }>
  }

  transformToMeiliSearchParams: (
    params: Params
  ) => {
    q: any
    facetsDistribution: any
    facetFilters: any
    attributesToHighlight: string[]
    attributesToCrop: string[] | undefined
    filters: any
    limit: number
  }
  parseHits: (meiliSearchHits: any, params: Params) => any
  paginationParams: (
    hitsLength: number,
    params: Params
  ) => { nbPages: number; page: number | undefined } | undefined

  search: (
    requests: Requests
  ) => Promise<{
    results: Array<{
      hits: any
      index: string
      hitsPerPage: number
      facets: object | undefined
      exhaustiveFacetsCount?: boolean | undefined
      processingTimeMs: number
      exhaustiveNbHits: boolean
    }>
  }>
}

export default function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    attributesToHighlight: ['*'],
    paginationTotalHits: options.paginationTotalHits || 200,
    placeholderSearch: options.placeholderSearch !== false, // true by default

    transformToMeiliSearchParams: function (params: Params) {
      const limit = this.pagination // if pagination widget is set, use paginationTotalHits as limit
        ? this.paginationTotalHits
        : this.hitsPerPage!
      const {
        query,
        facets,
        facetFilters,
        attributesToSnippet,
        attributesToRetrieve,
        filters,
      } = params
      const searchInput = {
        q: query,
        facetsDistribution: facets.length ? facets : undefined,
        facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        attributesToCrop: attributesToSnippet,
        attributesToRetrieve,
        filters,
        limit: this.placeholderSearch === false && query === '' ? 0 : limit,
      }
      return removeUndefinedFromObject(searchInput)
    },

    parseHits: function (meiliSearchHits, params: Params) {
      if (this.pagination) {
        params.page ||= 0
        const start = params.page * this.hitsPerPage!
        meiliSearchHits = meiliSearchHits.splice(start, this.hitsPerPage)
      }

      return meiliSearchHits.map((hit: any) => {
        const formattedHit = hit._formatted
        delete hit._formatted
        return {
          ...hit,
          _highlightResult: createHighlighResult({ formattedHit, ...params }),
          _snippetResult: createSnippetResult({ formattedHit, ...params }),
        }
      })
    },

    paginationParams: function (hitsLength: number, params: Params) {
      if (this.pagination) {
        const adjust = hitsLength % this.hitsPerPage! === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage!) + adjust
        return {
          nbPages: nbPages, // total number of pages
          page: params.page, // the current page, information sent by InstantSearch
        }
      }
    },

    parseMeiliSearchResponse: function (
      indexUid: string,
      meiliSearchResponse: SearchResponse<any, any>,
      params: Params
    ) {
      const {
        exhaustiveFacetsCount,
        exhaustiveNbHits,
        facetsDistribution: facets,
        nbHits,
        processingTimeMs,
        query,
        hits,
      } = meiliSearchResponse

      const parsedResponse = {
        index: indexUid,
        hitsPerPage: this.hitsPerPage!,
        facets,
        exhaustiveFacetsCount,
        exhaustiveNbHits,
        nbHits,
        processingTimeMs,
        query,
        ...this.paginationParams(hits.length, params),
        hits: this.parseHits(hits, params), // Apply pagination + highlight
      }

      return {
        results: [removeUndefinedFromObject(parsedResponse)],
      }
    },

    search: async function (requests: Requests) {
      // Params got from InstantSearch
      const params = requests[0].params
      this.pagination = params.page !== undefined // If the pagination widget has been set
      this.hitsPerPage = params.hitsPerPage || 20 // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
      // Gets information from IS and transforms it for MeiliSearch
      const searchInput = this.transformToMeiliSearchParams(params)
      const indexUid = requests[0].indexName
      // Executes the search with MeiliSearch
      const searchResponse = await this.client
        .getIndex(indexUid)
        .search(searchInput.q, searchInput)
      // Parses the MeiliSearch response and returns it for InstantSearch
      return this.parseMeiliSearchResponse(
        indexUid,
        searchResponse,
        requests[0].params
      )
    },
  }
}
