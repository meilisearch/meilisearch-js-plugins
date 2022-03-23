import { adaptSearchParams } from '../search-params-adapter'

test('Adapt basic SearchContext ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
    finitePagination: false,
  })
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with filters, sort and no geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    sort: 'id < 1',
    defaultFacetDistribution: {},
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

test('Adapt SearchContext with filters, sort and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
    defaultFacetDistribution: {},
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

test('Adapt SearchContext with only facetFilters and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
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

test('Adapt SearchContext with only sort and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
  expect(searchParams.sort).toStrictEqual(['id < 1'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with no sort and no filters and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with finite pagination', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: true,
  })

  expect(searchParams.limit).toBe(20)
})

test('Adapt SearchContext with finite pagination on a later page', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 10, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: true,
  })

  expect(searchParams.limit).toBe(20)
})

test('Adapt SearchContext with finite pagination and pagination total hits lower than hitsPerPage', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: true,
  })

  expect(searchParams.limit).toBe(4)
})

test('Adapt SearchContext with no finite pagination', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.limit).toBe(7)
})

test('Adapt SearchContext with no finite pagination on page 2', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 1, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.limit).toBe(13)
})

test('Adapt SearchContext with no finite pagination on page higher than paginationTotalHits', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 20, page: 40, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.limit).toBe(20)
})

test('Adapt SearchContext with no finite pagination and pagination total hits lower than hitsPerPage', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
    finitePagination: false,
  })

  expect(searchParams.limit).toBe(4)
})

test('Adapt SearchContext placeholderSearch set to false', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    query: '',
    pagination: { paginationTotalHits: 4, page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
    finitePagination: false,
    placeholderSearch: false,
  })

  expect(searchParams.limit).toBe(0)
})

test('Adapt SearchContext placeholderSearch set to false', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    query: '',
    pagination: { paginationTotalHits: 200, page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
    finitePagination: false,
    placeholderSearch: true,
  })

  expect(searchParams.limit).toBe(7)
})
