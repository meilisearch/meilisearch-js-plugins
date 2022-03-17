import { addMissingFacets } from '../filters'

test('One field in cache present in distribution', () => {
  const returnedDistribution = addMissingFacets(
    { genre: ['comedy'] },
    { genre: { comedy: 1 } }
  )
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 1 } })
})

test('One field in cache not present in distribution', () => {
  const returnedDistribution = addMissingFacets({ genre: ['comedy'] }, {})
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 0 } })
})

test('two field in cache only one present in distribution', () => {
  const returnedDistribution = addMissingFacets(
    { genre: ['comedy'], title: ['hamlet'] },
    { genre: { comedy: 12 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12 },
    title: { hamlet: 0 },
  })
})

test('two field in cache w/ different facet name none present in distribution', () => {
  const returnedDistribution = addMissingFacets(
    { genre: ['comedy'], title: ['hamlet'] },
    {}
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 0 },
    title: { hamlet: 0 },
  })
})

test('two field in cache w/ different facet name both present in distribution', () => {
  const returnedDistribution = addMissingFacets(
    { genre: ['comedy'], title: ['hamlet'] },
    { genre: { comedy: 12 }, title: { hamlet: 1 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12 },
    title: { hamlet: 1 },
  })
})

test('Three field in cache w/ different facet name two present in distribution', () => {
  const returnedDistribution = addMissingFacets(
    { genre: ['comedy', 'horror'], title: ['hamlet'] },
    { genre: { comedy: 12 }, title: { hamlet: 1 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12, horror: 0 },
    title: { hamlet: 1 },
  })
})

test('Cache is undefined and facets distribution is not', () => {
  const returnedDistribution = addMissingFacets(undefined, {
    genre: { comedy: 12 },
  })
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 12 } })
})

test('Cache is empty object and facets distribution is not', () => {
  const returnedDistribution = addMissingFacets({}, { genre: { comedy: 12 } })
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 12 } })
})

test('Cache is empty object and facets distribution empty object', () => {
  const returnedDistribution = addMissingFacets({}, {})
  expect(returnedDistribution).toMatchObject({})
})

test('Cache is undefined and facets distribution empty object', () => {
  const returnedDistribution = addMissingFacets(undefined, {})
  expect(returnedDistribution).toMatchObject({})
})

test('Cache is undefined and facets distribution is undefined', () => {
  const returnedDistribution = addMissingFacets(undefined, undefined)
  expect(returnedDistribution).toMatchObject({})
})
