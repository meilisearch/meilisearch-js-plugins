import { adaptSearchParams } from '../search-params-adapter'

const DEFAULT_CONTEXT = {
  indexUid: 'test',
  pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
  defaultFacetDistribution: {},
}

describe('Parameters adapter', () => {
  test('adapting a basic searchContext ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      finitePagination: false,
    })
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })
  test('adapting a searchContext with filters and sort', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      sort: 'id < 1',
      finitePagination: false,
    })

    expect(searchParams.filter).toStrictEqual([
      ['genres="Drama"', 'genres="Thriller"'],
      ['title="Ariel"'],
    ])
    expect(searchParams.sort).toStrictEqual(['id < 1'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })
})

describe('Geo rules adapter', () => {
  test('adapting a searchContext with filters, sort and geo rules ', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      insideBoundingBox: '0,0,0,0',
      sort: 'id < 1',
      finitePagination: false,
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
      finitePagination: false,
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
      finitePagination: false,
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
      finitePagination: false,
    })

    expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
    expect(searchParams.attributesToHighlight).toContain('*')
    expect(searchParams.attributesToHighlight?.length).toBe(1)
  })
})

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
      pagination: { paginationTotalHits: 20, page: 10, hitsPerPage: 6 },
      finitePagination: true,
    })

    expect(searchParams.limit).toBe(20)
  })

  test('adapting a searchContext with finite pagination and pagination total hits lower than hitsPerPage', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
      finitePagination: true,
    })

    expect(searchParams.limit).toBe(4)
  })

  test('adapting a searchContext with no finite pagination', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      finitePagination: false,
    })

    expect(searchParams.limit).toBe(7)
  })

  test('adapting a searchContext with no finite pagination on page 2', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { paginationTotalHits: 20, page: 1, hitsPerPage: 6 },
      finitePagination: false,
    })

    expect(searchParams.limit).toBe(13)
  })

  test('adapting a searchContext with no finite pagination on page higher than paginationTotalHits', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { paginationTotalHits: 20, page: 40, hitsPerPage: 6 },
      finitePagination: false,
    })

    expect(searchParams.limit).toBe(20)
  })

  test('adapting a searchContext with no finite pagination and pagination total hits lower than hitsPerPage', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
      finitePagination: false,
    })

    expect(searchParams.limit).toBe(4)
  })

  test('adapting a searchContext placeholderSearch set to false', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
      finitePagination: false,
      placeholderSearch: false,
    })

    expect(searchParams.limit).toBe(0)
  })

  test('adapting a searchContext placeholderSearch set to false', () => {
    const searchParams = adaptSearchParams({
      ...DEFAULT_CONTEXT,
      query: '',
      pagination: { paginationTotalHits: 200, page: 0, hitsPerPage: 6 },
      finitePagination: false,
      placeholderSearch: true,
    })

    expect(searchParams.limit).toBe(7)
  })
})
