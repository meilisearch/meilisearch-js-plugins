import { MeiliSearch } from 'meilisearch'
import { createHighlighResult, createSnippetResult } from './format'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  InstantSearchTypes,
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

    createISPaginationParams: function (hitsLength, { page }) {
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

    paginateISHits: function ({ page }, meiliSearchHits) {
      if (this.pagination) {
        const nbPage = page || 0
        const start = nbPage * this.hitsPerPage!
        const slicedMeiliSearchHits = meiliSearchHits.splice(
          start,
          this.hitsPerPage
        )
        return slicedMeiliSearchHits
      }
      return meiliSearchHits
    },

    transformToISHits: function (meiliSearchHits, instantSearchParams) {
      const paginatedHits = this.paginateISHits(
        instantSearchParams,
        meiliSearchHits
      )
      return paginatedHits.map((hit: Record<string, any>) => {
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
    },

    transformToISResponse: function (
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
      const pagination = this.createISPaginationParams(
        hits.length,
        instantSearchParams
      )
      const ISHits = this.transformToISHits(hits, instantSearchParams)
      const ISResponse = {
        index: indexUid,
        hitsPerPage: this.hitsPerPage,
        ...(facets && { facets }),
        ...(exhaustiveFacetsCount && { exhaustiveFacetsCount }),
        exhaustiveNbHits,
        nbHits,
        processingTimeMS: processingTimeMs,
        query,
        ...(pagination && pagination),
        hits: ISHits, // Apply pagination + highlight
      }
      return {
        results: [ISResponse],
      }
    },

    /*
      SEARCH
    */
    search: async function ([
      isSearchRequest,
    ]: InstantSearchTypes.SearchRequest[]) {
      try {
        // Params got from InstantSearch
        const {
          params: instantSearchParams,
          indexName: indexUid,
        } = isSearchRequest
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
        return this.transformToISResponse(
          indexUid,
          searchResponse,
          instantSearchParams
        )
      } catch (e) {
        console.error(e)
        throw new Error(e)
      }
    },
  }
}
