import { addMissingFacetZeroFields } from '../'

test('One field in cache present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy'] },
    { genre: { comedy: 1 } }
  )
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 1 } })
})

test('One field in cache not present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy'] },
    {}
  )
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 0 } })
})

test('two field in cache only one present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy'], title: ['hamlet'] },
    { genre: { comedy: 12 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12 },
    title: { hamlet: 0 },
  })
})

test('two field in cache w/ different facet name none present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy'], title: ['hamlet'] },
    {}
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 0 },
    title: { hamlet: 0 },
  })
})

test('two field in cache w/ different facet name both present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy'], title: ['hamlet'] },
    { genre: { comedy: 12 }, title: { hamlet: 1 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12 },
    title: { hamlet: 1 },
  })
})

test('Three field in cache w/ different facet name two present in distribution', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    { genre: ['comedy', 'horror'], title: ['hamlet'] },
    { genre: { comedy: 12 }, title: { hamlet: 1 } }
  )
  expect(returnedDistribution).toMatchObject({
    genre: { comedy: 12, horror: 0 },
    title: { hamlet: 1 },
  })
})

test('Cache is undefined and facets distribution is not', () => {
  const returnedDistribution = addMissingFacetZeroFields(undefined, {
    genre: { comedy: 12 },
  })
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 12 } })
})

test('Cache is empty object and facets distribution is not', () => {
  const returnedDistribution = addMissingFacetZeroFields(
    {},
    { genre: { comedy: 12 } }
  )
  expect(returnedDistribution).toMatchObject({ genre: { comedy: 12 } })
})

test('Cache is empty object and facets distribution empty object', () => {
  const returnedDistribution = addMissingFacetZeroFields({}, {})
  expect(returnedDistribution).toMatchObject({})
})

test('Cache is undefined and facets distribution empty object', () => {
  const returnedDistribution = addMissingFacetZeroFields(undefined, {})
  expect(returnedDistribution).toMatchObject({})
})

test('Cache is undefined and facets distribution is undefined', () => {
  const returnedDistribution = addMissingFacetZeroFields(undefined, undefined)
  expect(returnedDistribution).toMatchObject({})
})
