import MeiliSearch from 'meilisearch'
import { isString, removeUndefinedFromObject } from './utils.js'

export default function instantMeiliSearch(hostUrl, apiKey, options = {}) {
  return {
    client: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    attributesToHighlight: ['*'],
    paginationTotalHits: options.paginationTotalHits || 200,
    placeholderSearch: options.placeholderSearch !== false, // true by default

    transformToMeiliSearchParams: function (params) {
      const limit = this.pagination // if pagination widget is set, use paginationTotalHits as limit
        ? this.paginationTotalHits
        : this.hitsPerPage
      const searchInput = {
        q: this.placeholderSearch && params.query === '' ? null : params.query,
        facetsDistribution: params.facets.length ? params.facets : undefined,
        facetFilters: params.facetFilters,
        attributesToHighlight: this.attributesToHighlight,
        attributesToCrop: params.attributesToSnippet,
        limit,
      }
      return removeUndefinedFromObject(searchInput)
    },

    replaceHighlightTags: function (value, highlightPreTag, highlightPostTag) {
      let newHighlightValue = value || ''
      // If the value of the attribute is a string,
      // the highlight is applied by MeiliSearch (<em> tags)
      // and we replace the <em> by the expected tag for InstantSearch
      if (isString(value)) {
        newHighlightValue = value
          .replace(/<em>/g, highlightPreTag)
          .replace(/<\/em>/g, highlightPostTag)
      }
      return newHighlightValue.toString()
    },

    createHighlighResult: function (
      formattedHit,
      highlightPreTag,
      highlightPostTag
    ) {
      // formattedHit is the `_formatted` object returned by MeiliSearch.
      // It contains all the highlighted and croped attributes
      return Object.keys(formattedHit).reduce((result, key) => {
        result[key] = {
          value: this.replaceHighlightTags(
            formattedHit[key],
            highlightPreTag,
            highlightPostTag
          ),
        }
        return result
      }, {})
    },

    createSnippetResult: function (
      formattedHit,
      attributesToSnippet,
      highlightPreTag,
      highlightPostTag
    ) {
      // formattedHit is the `_formatted` object returned by MeiliSearch.
      // It contains all the highlighted and croped attributes
      return Object.keys(formattedHit).reduce((result, key) => {
        if (attributesToSnippet.includes(key)) {
          result[key] = {
            value: this.replaceHighlightTags(
              formattedHit[key],
              highlightPreTag,
              highlightPostTag
            ),
          }
        }
        return result
      }, {})
    },

    parseHits: function (meiliSearchHits, params) {
      if (this.pagination) {
        const start = params.page * this.hitsPerPage
        meiliSearchHits = meiliSearchHits.splice(start, this.hitsPerPage)
      }

      const attributesToSnippet = params.attributesToSnippet.map(
        (attribute) => attribute.split(':')[0]
      )

      return meiliSearchHits.map((hit) => {
        const formattedHit = hit._formatted
        delete hit._formatted
        return {
          ...hit,
          _highlightResult: this.createHighlighResult(
            formattedHit,
            params.highlightPreTag,
            params.highlightPostTag
          ),
          _snippetResult: this.createSnippetResult(
            formattedHit,
            attributesToSnippet,
            params.highlightPreTag,
            params.highlightPostTag
          ),
        }
      })
    },

    paginationParams: function (hitsLength, params) {
      if (this.pagination) {
        const adjust = hitsLength % this.hitsPerPage === 0 ? 0 : 1
        const nbPages = Math.floor(hitsLength / this.hitsPerPage) + adjust
        return {
          nbPages: nbPages, // total number of pages
          page: params.page, // the current page, information sent by InstantSearch
        }
      }
    },

    parseMeiliSearchResponse: function (indexUid, meiliSearchResponse, params) {
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
