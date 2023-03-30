import { adaptSearchParams } from '../search-params-adapter'
import { MatchingStrategies, SearchContext } from '../../../types'

const DEFAULT_CONTEXT: SearchContext = {
  indexUid: 'test',
  pagination: { page: 0, hitsPerPage: 6, finite: false },
  placeholderSearch: true,
  keepZeroFacets: false,
}

describe('Parameters adapter', () => {
  test('adapting a basic searchContext ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
    })

    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with filters and sort', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      sort: 'id < 1',
    })

    expect(searchParams.filter).toStrictEqual([
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with matching strategy', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      matchingStrategy: MatchingStrategies.ALL,
    })

    expect(searchParams.matchingStrategy).toEqual('all')
  })
})

describe('Geo filter adapter', () => {
  test('adapting a searchContext with filters, sort and geo filters ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      insideBoundingBox: '0,0,0,0',
      sort: 'id < 1',
    })

    expect(searchParams.filter).toStrictEqual([
      '_geoBoundingBox([0, 0], [0, 0])',
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with only facetFilters and geo filters ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      insideBoundingBox: '0,0,0,0',
    })

    expect(searchParams.filter).toEqual([
      '_geoBoundingBox([0, 0], [0, 0])',
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with only sort and geo filters ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      insideBoundingBox: '0,0,0,0',
      sort: 'id < 1',
    })

    expect(searchParams.filter).toEqual(['_geoBoundingBox([0, 0], [0, 0])'])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with no sort and no filters and geo filters ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      insideBoundingBox: '0,0,0,0',
    })

    expect(searchParams.filter).toEqual(['_geoBoundingBox([0, 0], [0, 0])'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })
})

describe('Pagination adapter', () => {
  test('adapting a searchContext with finite pagination', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 0, hitsPerPage: 6, finite: true },
    })

    expect(searchParams.page).toBe(1)
    expect(searchParams.hitsPerPage).toBe(6)
  })

  test('adapting a searchContext with finite pagination on a later page', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 10, hitsPerPage: 6, finite: true },
    })

    expect(searchParams.page).toBe(11)
    expect(searchParams.hitsPerPage).toBe(6)
  })

  test('adapting a searchContext with no finite pagination on page 1', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
    })

    expect(searchParams.limit).toBe(7)
    expect(searchParams.offset).toBe(0)
  })

  test('adapting a searchContext with no finite pagination on page 2', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 1, hitsPerPage: 6, finite: false },
    })

    expect(searchParams.limit).toBe(7)
    expect(searchParams.offset).toBe(6)
  })

  test('adapting a finite pagination with no placeholderSearch', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { page: 4, hitsPerPage: 6, finite: true },
      placeholderSearch: false,
    })

    expect(searchParams.page).toBe(5)
    expect(searchParams.hitsPerPage).toBe(0)
  })

  test('adapting a finite pagination with no placeholderSearch and a query', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: 'a',
      pagination: { page: 4, hitsPerPage: 6, finite: true },
      placeholderSearch: false,
    })

    expect(searchParams.page).toBe(5)
    expect(searchParams.hitsPerPage).toBeGreaterThan(0)
  })

  test('adapting a finite pagination with no placeholderSearch and a facetFilter', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { page: 4, hitsPerPage: 6, finite: true },
      placeholderSearch: false,
      facetFilters: ['genres:Action'],
    })

    expect(searchParams.page).toBe(5)
    expect(searchParams.hitsPerPage).toBeGreaterThan(0)
  })

  test('adapting a scroll pagination with no placeholderSearch', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { page: 4, hitsPerPage: 6, finite: false },
      placeholderSearch: false,
    })

    expect(searchParams.limit).toBe(0)
    expect(searchParams.offset).toBe(0)
  })

  test('adapting a scroll pagination with no placeholderSearch and a query', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: 'a',
      pagination: { page: 4, hitsPerPage: 6, finite: false },
      placeholderSearch: false,
    })

    expect(searchParams.limit).toBeGreaterThan(0)
    expect(searchParams.offset).toBeGreaterThan(0)
  })

  test('adapting a scroll pagination with no placeholderSearch and a facetFilter', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: 'a',
      pagination: { page: 4, hitsPerPage: 6, finite: false },
      placeholderSearch: false,
      facetFilters: ['genres:Action'],
    })

    expect(searchParams.limit).toBeGreaterThan(0)
    expect(searchParams.offset).toBeGreaterThan(0)
  })
})
