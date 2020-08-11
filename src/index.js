import MeiliSearch from 'meilisearch'
import { isString, removeUndefinedFromObject } from './utils.js'

export default function instantMeiliSearch(hostUrl, apiKey, options = {}) {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    hitsPerPage: options.hitsPerPage || 10,
    totalResults: options.totalResults || 50,
    attributesToHighlight: ['*'],
    placeholderSearch: options.placeholderSearch !== false, // true by default

    transformToMeiliSearchParams: function (params) {
      const searchInput = {
        q: this.placeholderSearch && params.query === '' ? null : params.query,
        facetsDistribution: params.facets.length ? params.facets : undefined,
        facetFilters: params.facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        limit: this.totalResults,
      }
      return removeUndefinedFromObject(searchInput)
    },

    replaceHighlightTags: function (
      formattedHit,
      highlightPreTag,
      highlightPostTag
    ) {
      // formattedHit is the `_formatted` object returned by MeiliSearch.
      // It contains all the highlighted attributes
      return Object.keys(formattedHit).reduce((result, key) => {
        let newHighlightString = formattedHit[key] || ''
        // If the value of the attribute is a string,
        // the highlight is applied by MeiliSearch (<em> tags)
        // and we replace the <em> by the expected tag for InstantSearch
        if (isString(formattedHit[key])) {
          newHighlightString = formattedHit[key]
            .replace(/<em>/g, highlightPreTag)
            .replace(/<\/em>/g, highlightPostTag)
        }
        result[key] = { value: newHighlightString.toString() }
        return result
      }, {})
    },

    parseHits: function (meiliSearchHits, params) {
      if (params.page !== undefined) {
        // If there is a pagination widget set
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
          nbPages: nbPages, // total number of pages
          page: params.page, // the current page, information sent by InstantSearch
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
        hits: this.parseHits(hits, params), // Apply pagination + highlight
      }

      return {
        results: [removeUndefinedFromObject(parsedResponse)],
      }
    },

    search: async function (requests) {
      // Gets information from IS and transforms it for MeiliSearch
      const searchInput = this.transformToMeiliSearchParams(requests[0].params)
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
