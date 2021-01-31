import { MeiliSearch } from 'meilisearch'
import { createHighlighResult, createSnippetResult } from './format'
import { removeUndefinedFromObject } from './utils'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  MeiliSearchTypes,
  AISSearchParams,
  AISSearchRequests,
  IMResponse,
} from './types'

export function instantMeiliSearch<T>(
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    attributesToHighlight: ['*'],
    paginationTotalHits: options.paginationTotalHits || 200,
    placeholderSearch: options.placeholderSearch !== false, // true by default

    transformToMeiliSearchParams: function (
      instantSearchParams: AISSearchParams
    ) {
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
      } = instantSearchParams
      const MSSearchRequest = {
        q: query,
        facetsDistribution: facets.length ? facets : undefined,
        facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        attributesToCrop: attributesToSnippet,
        attributesToRetrieve,
        filters,
        limit: this.placeholderSearch === false && query === '' ? 0 : limit,
      }
      return removeUndefinedFromObject(MSSearchRequest)
    },



    paginationParams: function (
      hitsLength: number,
      instantSearchParams: AISSearchParams
    ) {
      if (this.pagination) {
        const adjust = hitsLength % this.hitsPerPage! === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage!) + adjust
        const { page } = instantSearchParams
        return {
          nbPages, // total number of pages
          page, // the current page, information sent by InstantSearch
        }
      }
    },

    parseMeiliSearchResponse: function <T, P>(
      indexUid: string,
      meiliSearchResponse: MeiliSearchTypes.SearchResponse<T, P>,
      instantSearchParams: AISSearchParams
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
        ...this.paginationParams(hits.length, instantSearchParams),
        hits: this.parseHits(hits, instantSearchParams), // Apply pagination + highlight
      }

      return {
        results: [removeUndefinedFromObject(parsedResponse)],
      }
    },

    parseHits: function (
      meiliSearchHits,
      instantSearchParams: AISSearchParams
    ) {
      if (this.pagination) {
        let { page } = instantSearchParams
        page ||= 0
        const start = page * this.hitsPerPage!
        meiliSearchHits = meiliSearchHits.splice(start, this.hitsPerPage)
      }

      return meiliSearchHits.map((hit: MeiliSearchTypes.Hit<T>) => {
        const formattedHit = hit._formatted
        delete hit._formatted
        return {
          ...hit,
          _highlightResult: createHighlighResult({
            formattedHit,
            ...instantSearchParams,
          }),
          _snippetResult: createSnippetResult({
            formattedHit,
            ...instantSearchParams,
          }),
        }
      })
    },

    search: async function ([aisSearchRequest]: AISSearchRequests) {
      try {
        // Params got from InstantSearch
        const { instantSearchParams, indexName: indexUid } = aisSearchRequest
        const { page, hitsPerPage } = instantSearchParams

        this.pagination = page !== undefined // If the pagination widget has been set
        this.hitsPerPage = hitsPerPage || 20 // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
        // Gets information from IS and transforms it for MeiliSearch
        const msSearchParams = this.transformToMeiliSearchParams(
          instantSearchParams
        )
        // Executes the search with MeiliSearch
        const searchResponse = await this.client
          .index(indexUid)
          .search(msSearchParams.q, msSearchParams)
        // Parses the MeiliSearch response and returns it for InstantSearch
        return this.parseMeiliSearchResponse<
          T,
          MeiliSearchTypes.SearchParams<T>
        >(indexUid, searchResponse, instantSearchParams)
      } catch (e) {
        console.error(e)
        throw new Error(e)
      }
    },
  }
}
