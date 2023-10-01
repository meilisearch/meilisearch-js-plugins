import { fillMissingFacets } from '../init-facets-distribution'

describe('Fill missing facets', () => {
  it('should fill missing facets without changing the results', () => {
    const initialFacetDistribution = {
      movies: {
        'categories.lvl0': {
          goods: 6,
        },
        genres: {
          Action: 2,
        },
      },
    }

    const searchResults = [
      {
        hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
        processingTimeMs: 0,
        query: '',
        indexUid: 'movies',
        pagination: {
          finite: true,
          hitsPerPage: 0,
          page: 0,
        },
        facetDistribution: {
          'categories.lvl0': {
            goods: 42,
          },
          'categories.lvl1': {
            'goods > to drink': 1,
          },
          genres: {
            Action: 1,
          },
        },
      },
    ]

    const result = fillMissingFacets(initialFacetDistribution, searchResults)
    expect(result).toEqual({
      movies: {
        'categories.lvl0': {
          goods: 6,
        },
        'categories.lvl1': {
          'goods > to drink': 1,
        },
        genres: {
          Action: 2,
        },
      },
    })
  })
})
