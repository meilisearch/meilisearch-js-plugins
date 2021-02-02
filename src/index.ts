import { MeiliSearch } from 'meilisearch2'
import { createHighlighResult, createSnippetResult } from './format'
import { removeUndefinedFromObject } from './utils'
import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchInstance,
  MeiliSearchTypes,
  AISSearchParams,
  AISSearchRequests,
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

    transformToMeiliSearchParams: function ({
      query,
      facets,
      facetFilters,
      attributesToSnippet,
      attributesToRetrieve,
      filters,
    }: AISSearchParams) {
      const limit = this.pagination // if pagination widget is set, use paginationTotalHits as limit
        ? this.paginationTotalHits
        : this.hitsPerPage!

      return removeUndefinedFromObject({
        q: query,
        facetsDistribution: facets.length ? facets : undefined,
        facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        attributesToCrop: attributesToSnippet,
        attributesToRetrieve,
        filters,
        limit: this.placeholderSearch === false && query === '' ? 0 : limit,
      })
    },

    paginationParams: function (hitsLength: number, { page }: AISSearchParams) {
      if (this.pagination) {
        const adjust = hitsLength % this.hitsPerPage! === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage!) + adjust
        return {
          nbPages, // total number of pages
          page, // the current page, information sent by InstantSearch
        }
      }
    },

    transformToIMResponse: function (
      indexUid: string,
      {
        exhaustiveFacetsCount,
        exhaustiveNbHits,
        facetsDistribution: facets,
        nbHits,
        processingTimeMs,
        query,
        hits,
      }: MeiliSearchTypes.SearchResponse,
      instantSearchParams: AISSearchParams
    ) {
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
        hits: this.transformToIMHits(hits, instantSearchParams), // Apply pagination + highlight
      }

      return {
        results: [removeUndefinedFromObject(parsedResponse)],
      }
    },

    paginateIMHits: function (
      { page }: AISSearchParams,
      meiliSearchHits: MeiliSearchTypes.Hits
    ): MeiliSearchTypes.Hits {
      if (this.pagination) {
        page ||= 0
        const start = page * this.hitsPerPage!
        const slicedMeiliSearchHits = meiliSearchHits.splice(
          start,
          this.hitsPerPage
        )
        return slicedMeiliSearchHits
      }
      return meiliSearchHits
    },

    transformToIMHits: function (
      meiliSearchHits: MeiliSearchTypes.Hits,
      instantSearchParams: AISSearchParams
    ) {
      const paginatedHits = this.paginateIMHits(
        instantSearchParams,
        meiliSearchHits
      )

      return [paginatedHits as any[]].map((hit: MeiliSearchTypes.Hit) => {
        const formattedHit = hit._formatted
        delete hit._formatted
        const modifiedHit = {
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
        console.log(modifiedHit)
        return modifiedHit
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
        return this.transformToIMResponse(
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
