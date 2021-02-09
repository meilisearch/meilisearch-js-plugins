import { MeiliSearch } from 'meilisearch'
import { createHighlighResult, createSnippetResult } from './format'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  InstantsearchTypes,
} from './types'

export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    attributesToHighlight: ['*'],
    paginationTotalHits: options.paginationTotalHits || 200,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    hitsPerPage: 20,

    /*
      REQUEST CONSTRUCTION
    */
    transformToMeiliSearchParams: function ({
      query,
      facets,
      facetFilters,
      attributesToSnippet,
      attributesToRetrieve,
      filters,
    }) {
      const limit = this.pagination // if pagination widget is set, use paginationTotalHits as limit
        ? this.paginationTotalHits
        : this.hitsPerPage

      return {
        q: query,
        facets: facets || { facetsDistribution: [] },
        ...(facets?.length && { facetsDistribution: facets }),
        ...(facetFilters && { facetFilters }),
        ...(this.attributesToHighlight && {
          attributesToHighlight: this.attributesToHighlight,
        }),
        ...(attributesToSnippet && {
          attributesToCrop: attributesToSnippet,
        }),
        ...(attributesToRetrieve && { attributesToRetrieve }),
        ...(filters && { filters }),
        limit:
          (this.placeholderSearch === false && query === '') ||
          limit === undefined
            ? 0
            : limit,
      }
    },

    /*
      RESPONSE CONSTRUCTION
    */

    paginationParams: function (hitsLength, { page }) {
      if (this.pagination) {
        const adjust = hitsLength % this.hitsPerPage! === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage!) + adjust
        return {
          nbPages, // total number of pages
          page, // the current page, information sent by InstantSearch
        }
      }
      return undefined
    },

    paginateIMHits: function ({ page }, meiliSearchHits) {
      if (this.pagination) {
        const nbPage = page || 0
        const start = nbPage * this.hitsPerPage!
        const slicedMeiliSearchHits = meiliSearchHits.slice(
          start,
          this.hitsPerPage
        )
        return slicedMeiliSearchHits
      }
      return meiliSearchHits
    },

    transformToIMHits: function (meiliSearchHits, instantSearchParams) {
      console.log('FIRST')
      const paginatedHits = this.paginateIMHits(
        instantSearchParams,
        meiliSearchHits
      )
      const test = paginatedHits.map((hit: Record<string, any>) => {
        const { _formatted: formattedHit, ...restOfHit } = hit
        const modifiedHit = {
          ...restOfHit,
          _highlightResult: createHighlighResult({
            formattedHit,
            ...instantSearchParams,
          }),
          _snippetResult: createSnippetResult({
            formattedHit,
            ...instantSearchParams,
          }),
        }
        return modifiedHit
      })
      return test
    },

    transformToIMResponse: function (
      indexUid,
      {
        exhaustiveFacetsCount,
        exhaustiveNbHits,
        facetsDistribution: facets,
        nbHits,
        processingTimeMs,
        query,
        hits,
      },
      instantSearchParams
    ) {
      const pagination = this.paginationParams(hits.length, instantSearchParams)
      const IMhits = this.transformToIMHits(hits, instantSearchParams)
      const parsedResponse = {
        index: indexUid,
        hitsPerPage: this.hitsPerPage,
        ...(facets && { facets }),
        disjunctiveFacets: [],
        ...(exhaustiveFacetsCount && { exhaustiveFacetsCount }),
        exhaustiveNbHits,
        nbHits,
        processingTimeMs,
        query,
        ...(pagination && pagination),
        hits: IMhits, // Apply pagination + highlight
      }
      return {
        results: [parsedResponse],
      }
    },

    /*
      SEARCH
    */
    search: async function ([
      aisSearchRequest,
    ]: InstantsearchTypes.SearchRequest[]) {
      try {
        // Params got from InstantSearch

        console.log('MS !')
        const {
          params: instantSearchParams,
          indexName: indexUid,
        } = aisSearchRequest
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

        console.log('MS 2')
        // Parses the MeiliSearch response and returns it for InstantSearch
        const res = this.transformToIMResponse(
          indexUid,
          searchResponse,
          instantSearchParams
        )
        console.log({ IMRES: res })
        return res
      } catch (e) {
        console.error(e)
        throw new Error(e)
      }
    },
  }
}
