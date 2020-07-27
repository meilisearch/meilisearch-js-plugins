import MeiliSearch from 'meilisearch'
import { isString, removeUndefinedFromObject } from './utils.js'

export default function instantMeiliSearch(hostUrl, apiKey, options = {}) {
  return new InstantMeiliSearch(hostUrl, apiKey, options)
}

class InstantMeiliSearch {
  constructor(hostUrl, apiKey, options = {}) {
    this.client = new MeiliSearch({ host: hostUrl, apiKey: apiKey })
    this.hitsPerPage = options.hitsPerPage || 10
    this.limitPerRequest = options.limitPerRequest || 50
    this.attributesToHighlight = '*'
  }

  meiliSearchInputForSearch(params) {
    const searchInput = {
      q: params.query,
      facetsDistribution:
        params.facets.length === 0 ? undefined : params.facets,
      facetFilters: params.facetFilters,
      attributesToHighlight: this.attributesToHighlight,
      limit: this.limitPerRequest,
    }
    return removeUndefinedFromObject(searchInput)
  }

  parseHighlight(formattedHit, params) {
    return Object.keys(formattedHit).reduce((result, key) => {
      let newHighlightString = formattedHit[key]
      if (isString(formattedHit[key])) {
        newHighlightString = formattedHit[key]
          .replaceAll('<em>', params.highlightPreTag)
          .replaceAll('</em>', params.highlightPostTag)
      }
      result[key] = { value: newHighlightString.toString() }
      return result
    }, {})
  }

  parseHits(meiliSearchHits, params) {
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
        _highlightResult: this.parseHighlight(formattedHit, params),
      }
    })
  }

  paginationParams(hitsLength, params) {
    if (params.page !== undefined) {
      const adjust = hitsLength % this.hitsPerPage === 0 ? 0 : 1
      const nbPages = Math.floor(hitsLength / this.hitsPerPage) + adjust
      return {
        nbPages: nbPages,
        page: params.page,
      }
    }
  }

  parseMeiliSearchResponse(indexUid, meiliSearchResponse, params) {
    this.hitsPerPage = params.hitsPerPage || this.hitsPerPage
    const parsedResponse = {
      index: indexUid,
      hitsPerPage: this.hitsPerPage,
      exhaustiveFacetsCount: meiliSearchResponse.exhaustiveFacetsCount,
      exhaustiveNbHits: meiliSearchResponse.exhaustiveNbHits,
      facets: meiliSearchResponse.facetsDistribution,
      nbHits: meiliSearchResponse.nbHits,
      processingTimeMs: meiliSearchResponse.processingTimeMs,
      query: meiliSearchResponse.query,
      ...this.paginationParams(meiliSearchResponse.hits.length, params),
      hits: this.parseHits(meiliSearchResponse.hits, params),
    }
    return {
      results: [this.removeUndefinedFromObject(parsedResponse)],
    }
  }

  async search(requests) {
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
  }
}
