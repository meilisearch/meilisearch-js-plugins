import { extractFacets } from '../filters'

const facetCacheData = [
  {
    filters: [],
    expectedCache: {},
    cacheTestTitle: 'Empty filters should return empty filter cache',
  },
  {
    filters: 'genre=comedy',
    expectedCache: { genre: ['comedy'] },
    cacheTestTitle: 'Filters with one filters should return correctly',
  },
  {
    filters: ['genre=comedy'],
    expectedCache: { genre: ['comedy'] },
    cacheTestTitle:
      'Filters with one filter in an array should return correctly',
  },
  {
    filters: ['genre=comedy', 'title=hamlet'],
    expectedCache: { genre: ['comedy'], title: ['hamlet'] },
    cacheTestTitle:
      'Filters  with two filters w/ same filterName in an array should return correctly',
  },
  {
    filters: ['genre=comedy', 'title=hamlet', 'genre=horror'],
    expectedCache: { genre: ['comedy', 'horror'], title: ['hamlet'] },
    cacheTestTitle:
      'Filters with different filterNames in an array should return correctly',
  },
  {
    filters: ['genre=comedy', 'title=hamlet', ['genre=horror']],
    expectedCache: { genre: ['comedy', 'horror'], title: ['hamlet'] },
    cacheTestTitle:
      'Filters with one nested filter in an array should return correctly',
  },
  {
    filters: [['genre=comedy'], 'title=hamlet', ['genre=horror']],
    expectedCache: { genre: ['comedy', 'horror'], title: ['hamlet'] },
    cacheTestTitle:
      'Filters with two nested filter w/ same facet name in an array should return correctly',
  },
  {
    filters: [['genre=comedy', 'title=hamlet'], ['genre=horror']],
    expectedCache: { genre: ['comedy', 'horror'], title: ['hamlet'] },
    cacheTestTitle:
      'Filters with only nested filters in an array should return correctly',
  },
  {
    filters: [[], ['genre=horror']],
    expectedCache: { genre: ['horror'] },
    cacheTestTitle:
      'Filters with one nested filter and one empty nest should return correctly',
  },
]

describe.each(facetCacheData)(
  'Facet cache tests',
  ({ filters, expectedCache, cacheTestTitle }) => {
    it(cacheTestTitle, () => {
      const cache = extractFacets(
        // @ts-ignore ignore to avoid having to add all the searchContext
        { keepZeroFacets: false, defaultFacetDistribution: {} },
        { filter: filters }
      )
      expect(cache).toEqual(expectedCache)
    })
  }
)
