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
    paginationTotalHits: options.paginationTotalHits || 200,
    primaryKey: options.primaryKey || undefined,
    placeholderSearch: options.placeholderSearch !== false, // true by default
    hitsPerPage: 20,
    page: 0,

    /*
      REQUEST
    */

    transformToMeiliSearchParams: function ({
      query,
      facets,
      facetFilters,
      attributesToSnippet: attributesToCrop,
      attributesToRetrieve,
      attributesToHighlight,
      filters,
    }) {
      const limit = this.paginationTotalHits

      // Creates search params object compliant with MeiliSearch
      return {
        q: query,
        ...(facets?.length && { facetsDistribution: facets }),
        ...(facetFilters && { facetFilters }),
        ...(attributesToCrop && { attributesToCrop }),
        ...(attributesToRetrieve && { attributesToRetrieve }),
        ...(filters && { filters }),
        attributesToHighlight: attributesToHighlight || ['*'],
        limit: (!this.placeholderSearch && query === '') || !limit ? 0 : limit,
      }
    },

    /*
      RESPONSE
    */

    getNumberPages: function (hitsLength) {
      const adjust = hitsLength % this.hitsPerPage! === 0 ? 0 : 1
      return Math.floor(hitsLength / this.hitsPerPage!) + adjust // total number of pages
    },

    paginateHits: function (hits) {
      const start = this.page * this.hitsPerPage!
      return hits.splice(start, this.hitsPerPage)
    },

    transformToISHits: function (meiliSearchHits, instantSearchParams) {
      const paginatedHits = this.paginateHits(meiliSearchHits)

      return paginatedHits.map((hit: Record<string, any>) => {
        const { _formatted: formattedHit, ...restOfHit } = hit

        // Creates Hit object compliant with InstantSearch
        return {
          ...restOfHit,
          _highlightResult: createHighlighResult({
            formattedHit,
            ...instantSearchParams,
          }),
          _snippetResult: createSnippetResult({
            formattedHit,
            ...instantSearchParams,
          }),
          ...(this.primaryKey && { objectID: hit[this.primaryKey] }),
        }
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
      // Create response object compliant with InstantSearch
      const ISResponse = {
        index: indexUid,
        hitsPerPage: this.hitsPerPage,
        ...(facets && { facets }),
        ...(exhaustiveFacetsCount && { exhaustiveFacetsCount }),
        page: this.page,
        nbPages: this.getNumberPages(hits.length),
        exhaustiveNbHits,
        nbHits,
        processingTimeMS: processingTimeMs,
        query,
        hits: this.transformToISHits(hits, instantSearchParams),
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

        this.page = page || 0 // default page is 0 if none is provided
        this.hitsPerPage = hitsPerPage || 20 // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.

        // Transform IS params to MeiliSearch params
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
