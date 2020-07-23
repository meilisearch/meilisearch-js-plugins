import MeiliSearch from 'meilisearch'

// MEILISEARCH CLIENT

function instantMeiliSearch(hostUrl, apiKey, options = {}) {
  return new InstantMeiliSearch(hostUrl, apiKey, options)
}

class InstantMeiliSearch {
  constructor(hostUrl, apiKey, options = {}) {
    this.client = new MeiliSearch({ host: hostUrl, apiKey: apiKey })
    this.hitsPerPage = options.hitsPerPage || 10
    this.limitPerRequest = options.limitPerRequest || 20
    this.attributesToHighlight = '*'
  }

  removeUndefinedFromObject(object) {
    return Object.keys(object).reduce((result, key) => {
      if (object[key] !== undefined) {
        result[key] = object[key]
      }
      return result
    }, {})
  }

  isString(str) {
    return typeof str === 'string' || str instanceof String
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
    return this.removeUndefinedFromObject(searchInput)
  }

  parseHighlight(formattedHit, params) {
    return Object.keys(formattedHit).reduce((result, key) => {
      let newHighlightString = formattedHit[key]
      if (this.isString(formattedHit[key])) {
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
    console.log('IN SEARCH')
    console.log({ requests: requests })
    const searchInput = this.meiliSearchInputForSearch(requests[0].params)
    console.log({ searchInput: searchInput })
    const indexUid = requests[0].indexName
    const searchResponse = await this.client
      .getIndex(indexUid)
      .search(searchInput.q, searchInput)
    console.log({ searchResponse: searchResponse })
    const parsedResponse = this.parseMeiliSearchResponse(
      indexUid,
      searchResponse,
      requests[0].params
    )
    console.log({ parsedResponse: parsedResponse })
    return parsedResponse
  }
}

// END MEILISEARCH CLIENT

export default instantMeiliSearch
