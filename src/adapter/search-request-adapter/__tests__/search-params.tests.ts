import { adaptSearchParams } from '../search-params-adapter'

test('Adapt basic SearchContext ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
  })
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with filters, sort and no geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    sort: 'id < 1',
    defaultFacetDistribution: {},
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
    pagination: { page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
    defaultFacetDistribution: {},
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
    pagination: { page: 0, hitsPerPage: 6 },
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
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
    pagination: { page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
    defaultFacetDistribution: {},
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
  expect(searchParams.sort).toStrictEqual(['id < 1'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with no sort and no filters and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    pagination: { page: 0, hitsPerPage: 6 },
    insideBoundingBox: '0,0,0,0',
    defaultFacetDistribution: {},
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0.00000, 0.00000, 0)'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext placeholderSearch set to false', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    query: '',
    pagination: { page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
    placeholderSearch: false,
  })

  expect(searchParams.page).toBe(1)
  expect(searchParams.hitsPerPage).toBe(0)
})

test('Adapt SearchContext placeholderSearch set to false', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    query: '',
    pagination: { page: 0, hitsPerPage: 6 },
    defaultFacetDistribution: {},
    placeholderSearch: true,
  })

  expect(searchParams.page).toBe(1)
  expect(searchParams.hitsPerPage).toBe(6)
})
