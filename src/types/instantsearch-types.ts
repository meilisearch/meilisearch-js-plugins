export type GeoRectangle = [number, number, number, number]
export type GeoPolygon = [number, number, number, number, number, number]

// Documentation: https://www.algolia.com/doc/api-reference/search-api-parameters/
export type SearchParameters = {
  // Attributes
  attributesToRetrieve?: string[]
  restrictSearchableAttributes?: string[]

  // Filtering
  filters?: string
  facetFilters?: string[]
  optionalFilters?: string[]
  numericFilters?: string[]
  sumOrFiltersScores?: boolean

  // Faceting
  facets?: string[]
  maxValuesPerFacet?: number
  facetingAfterDistinct?: boolean
  sortFacetValuesBy?: string

  // Highlighting / Snippeting
  attributesToHighlight?: string[]
  attributesToSnippet?: string[]
  highlightPreTag?: string
  highlightPostTag?: string
  snippetEllipsisText?: string
  restrictHighlightAndSnippetArrays?: boolean

  // Pagination
  page?: number
  hitsPerPage?: number
  offset?: number
  length?: number

  // Typos
  minWordSizefor1Typo?: number
  minWordSizefor2Typos?: number
  typoTolerance?: string | boolean
  allowTyposOnNumericTokens?: boolean
  ignorePlurals?: boolean | string[]
  disableTypoToleranceOnAttributes?: string[]

  // Geo-Search
  aroundLatLng?: string
  aroundLatLngViaIP?: boolean
  aroundRadius?: number | 'all'
  aroundPrecision?: number
  minimumAroundRadius?: number
  insideBoundingBox?: GeoRectangle | GeoRectangle[]
  insidePolygon?: GeoPolygon | GeoPolygon[]

  // Query Strategy
  queryType?: string
  removeWordsIfNoResults?: string
  advancedSyntax?: boolean
  optionalWords?: string | string[]
  removeStopWords?: boolean | string[]
  disableExactOnAttributes?: string[]
  exactOnSingleWordQuery?: string
  alternativesAsExact?: string[]

  // Query Rules
  enableRules?: boolean
  ruleContexts?: string[]

  // Advanced
  minProximity?: number
  responseFields?: string[]
  maxFacetHits?: number
  percentileComputation?: boolean
  distinct?: number | boolean
  getRankingInfo?: boolean
  clickAnalytics?: boolean
  analytics?: boolean
  analyticsTags?: string[]
  synonyms?: boolean
  replaceSynonymsInHighlight?: boolean
}

export interface SearchRequestParameters extends SearchParameters {
  query: string
}

export interface SearchForFacetValuesRequestParameters
  extends SearchParameters {
  facetQuery: string
  facetName: string
}

export type SearchRequest = {
  indexName: string
  params: SearchRequestParameters
}

export type Hit<T = {}> = T & {
  [key: string]: any
  _highlightResult?: object
}

// Documentation: https://www.algolia.com/doc/rest-api/search/?language=javascript#search-multiple-indexes
export type SearchResponse = {
  hits: Hit[]
  page?: number
  nbHits?: number
  nbPages?: number
  hitsPerPage?: number
  processingTimeMS?: number
  query?: string
  params?: string
  index?: string
}

export type SearchClient = {
  search: (requests: SearchRequest[]) => Promise<{ results: SearchResponse[] }>
}
