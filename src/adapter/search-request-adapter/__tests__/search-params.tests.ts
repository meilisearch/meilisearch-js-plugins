import { adaptSearchParams } from '../search-params-adapter'
import { MatchingStrategies } from '../../../types'

const DEFAULT_CONTEXT = {
  indexUid: 'test',
  pagination: { page: 0, hitsPerPage: 6 },
  defaultFacetDistribution: {},
  finitePagination: false,
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

describe('Geo rules adapter', () => {
  test('adapting a searchContext with filters, sort and geo rules ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      insideBoundingBox: '0,0,0,0',
      sort: 'id < 1',
    })

    expect(searchParams.filter).toStrictEqual([
      '_geoRadius(0.00000, 0.00000, 0)',
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with only facetFilters and geo rules ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      insideBoundingBox: '0,0,0,0',
    })

    expect(searchParams.filter).toEqual([
      '_geoRadius(0.00000, 0.00000, 0)',
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with only sort and geo rules ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      insideBoundingBox: '0,0,0,0',
      sort: 'id < 1',
    })

    expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })

  test('adapting a searchContext with no sort and no filters and geo rules ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      insideBoundingBox: '0,0,0,0',
    })

    expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })
})

// TODO: UPDATE
describe('Pagination adapter', () => {
  test('adapting a searchContext with finite pagination', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      finitePagination: true,
    })

    expect(searchParams.limit).toBe(20)
  })

  test('adapting a searchContext with finite pagination on a later page', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 10, hitsPerPage: 6 },
      finitePagination: true,
    })

    expect(searchParams.limit).toBe(20)
  })

  test('adapting a searchContext with finite pagination and pagination total hits lower than hitsPerPage', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 0, hitsPerPage: 6 },
      finitePagination: true,
    })

    expect(searchParams.limit).toBe(4)
  })

  test('adapting a searchContext with no finite pagination', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
    })

    expect(searchParams.limit).toBe(7)
  })

  test('adapting a searchContext with no finite pagination on page 2', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 1, hitsPerPage: 6 },
    })

    expect(searchParams.limit).toBe(13)
  })

  // test('adapting a searchContext with no finite pagination on page higher than paginationTotalHits', () => {
  //   const searchParams = adaptSearchParams({
  //     ...DEFAULT_CONTEXT,
  //     pagination: { page: 40, hitsPerPage: 6 },
  //   })

  //   expect(searchParams.limit).toBe(20)
  // })

  test('adapting a searchContext with no finite pagination and pagination total hits lower than hitsPerPage', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { page: 0, hitsPerPage: 6 },
    })

    expect(searchParams.limit).toBe(4)
  })

  test('adapting a searchContext placeholderSearch set to false', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { page: 0, hitsPerPage: 6 },
      placeholderSearch: false,
    })

    expect(searchParams.limit).toBe(0)
  })

  test('adapting a searchContext placeholderSearch set to false', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { page: 0, hitsPerPage: 6 },
      placeholderSearch: true,
    })

    expect(searchParams.limit).toBe(7)
  })
})
