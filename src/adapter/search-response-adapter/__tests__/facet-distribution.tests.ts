import { adaptFacetDistribution } from '../../search-response-adapter/facet-distribution-adapter'

const facetDistribution = {
  movie: {
    genre: { comedy: 3, horror: 2, drama: 4 },
    releaseYear: { '1990': 10, '2001': 30 },
  },
}

describe('Facet distribution unit tests', () => {
  test('Fill facet values on one undefined facet', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      undefined,
      facetDistribution.movie,
      { genre: { comedy: 3 } }
    )

    expect(returnedDistribution).toEqual({})
  })

  test('Fill facet values on one facet in string format', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      'genre',
      facetDistribution.movie,
      { genre: { comedy: 3 } }
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 3, horror: 0, drama: 0 },
    })
  })

  test('Fill facet values on one facet in array format', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      ['genre'],
      facetDistribution.movie,
      { genre: { comedy: 3 } }
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 3, horror: 0, drama: 0 },
    })
  })

  test('Do not Fill facet values as keepZeroFacets is false', () => {
    const returnedDistribution = adaptFacetDistribution(
      false,
      ['genre'],
      facetDistribution.movie,
      { genre: { comedy: 3 } }
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 3 },
    })
  })

  test('Fill facet values on empty object distribution', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      'genre',
      facetDistribution.movie,
      {}
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 0, horror: 0, drama: 0 },
    })
  })

  test('Fill facet values on undefined distribution', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      'genre',
      facetDistribution.movie,
      undefined
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 0, horror: 0, drama: 0 },
    })
  })

  test('Fill facet values on empty default distribution and empty distribution', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      'genre',
      {},
      undefined
    )

    expect(returnedDistribution).toEqual({})
  })

  test('Fill facet values on two facets with only one with results', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      ['genre', 'releaseYear'],
      facetDistribution.movie,
      { genre: { comedy: 3 } }
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 3, horror: 0, drama: 0 },
      releaseYear: { '1990': 0, '2001': 0 },
    })
  })

  test('Fill facet values on two facets', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      ['genre', 'releaseYear'],
      facetDistribution.movie,
      { genre: { comedy: 3 }, releaseYear: { '1990': 1 } }
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 3, horror: 0, drama: 0 },
      releaseYear: { '1990': 1, '2001': 0 },
    })
  })

  test('Fill facet values on two empty facets', () => {
    const returnedDistribution = adaptFacetDistribution(
      true,
      ['genre', 'releaseYear'],
      facetDistribution.movie,
      {}
    )

    expect(returnedDistribution).toEqual({
      genre: { comedy: 0, horror: 0, drama: 0 },
      releaseYear: { '1990': 0, '2001': 0 },
    })
  })
})
