import MeiliSearch from 'meilisearch'
import { isString, removeUndefinedFromObject } from './utils.js'

export default function instantMeiliSearch(hostUrl, apiKey, options = {}) {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    hitsPerPage: options.hitsPerPage || 10,
    limitPerRequest: options.limitPerRequest || 50,
    attributesToHighlight: '*',

    transformToMeiliSearchParams: function (params) {
      const searchInput = {
        q: params.query,
        facetsDistribution: params.facets.length ? params.facets : undefined,
        facetFilters: params.facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        limit: this.limitPerRequest,
      }
      return removeUndefinedFromObject(searchInput)
    },

    replaceHighlightTags: function (
      formattedHit,
      highlightPreTag,
      highlightPostTag
    ) {
      return Object.keys(formattedHit).reduce((result, key) => {
        let newHighlightString = formattedHit[key]
        if (isString(formattedHit[key])) {
          newHighlightString = formattedHit[key]
            .replaceAll('<em>', highlightPreTag)
            .replaceAll('</em>', highlightPostTag)
        }
        result[key] = { value: newHighlightString.toString() }
        return result
      }, {})
    },

    parseHits: function (meiliSearchHits, params) {
      if (params.page !== undefined) {
        const hitsPerPage = this.hitsPerPage
        const start = params.page * hitsPerPage
        meiliSearchHits = meiliSearchHits.splice(start, this.hitsPerPage)
      }
      return meiliSearchHits.map((hit) => {
        const formattedHit = hit._formatted
        delete hit._formatted
        return {
          ...hit,
          _highlightResult: this.replaceHighlightTags(
            formattedHit,
            params.highlightPreTag,
            params.highlightPostTag
          ),
        }
      })
    },

    paginationParams: function (hitsLength, params) {
      if (params.page !== undefined) {
        const adjust = hitsLength % this.hitsPerPage === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage) + adjust
        return {
          nbPages: nbPages,
          page: params.page,
        }
      }
    },

    parseMeiliSearchResponse: function (indexUid, meiliSearchResponse, params) {
      this.hitsPerPage = params.hitsPerPage || this.hitsPerPage
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
        hitsPerPage: this.hitsPerPage,
        facets,
        exhaustiveFacetsCount,
        exhaustiveNbHits,
        nbHits,
        processingTimeMs,
        query,
        ...this.paginationParams(hits.length, params),
        hits: this.parseHits(hits, params),
      }
      return {
        results: [removeUndefinedFromObject(parsedResponse)],
      }
    },

    search: async function (requests) {
      const searchInput = this.meiliSearchInputForSearch(requests[0].params)
      const indexUid = requests[0].indexName
      const searchResponse = await this.client
        .getIndex(indexUid)
        .search(searchInput.q, searchInput)
      return this.parseMeiliSearchResponse(
        indexUid,
        searchResponse,
        requests[0].params
      )
    },
  }
}
