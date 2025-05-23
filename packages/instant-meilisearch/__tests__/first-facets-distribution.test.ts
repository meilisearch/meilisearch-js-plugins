import { describe, beforeAll, test, expect } from 'vitest'
import { dataset, meilisearchClient, HOST, API_KEY } from './assets/utils.js'
import { instantMeiliSearch } from '../src/index.js'

describe('Default facet distribution', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient
      .index('movies')
      .updateSettings({
        filterableAttributes: ['genres', 'release_date'],
        sortableAttributes: ['release_date'],
      })
      .waitTask()
    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
  })

  // Without facets
  // Without keepZeroFacets
  // With placeholderSearch
  // With empty query
  test('creation of facet distribution without facets', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY)
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: [],
          query: '',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({})
  })

  // Without facets
  // With keepZeroFacets
  // With placeholderSearch
  // With empty query
  test('creation of facet distribution without facets and with keepZeroFacets to true', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: true,
    })
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: [],
          query: '',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({})
  })

  // With facets
  // without keepZeroFacets
  // without placeholderSearch
  // With multiple searchs
  test('creation of facet distribution with facets, with keepZeroFacets to false and placeholdersearch to false', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: false,
      placeholderSearch: false, // only test false since `true` is default value
    })
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: '',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({
      genres: {
        Action: 3,
        Adventure: 1,
        Animation: 1,
        Comedy: 2,
        Crime: 4,
        Drama: 1,
        'Science Fiction': 2,
        Thriller: 1,
      },
    })

    // Ensure cached default facet distribution between searchClient is correct
    const response2 = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: 'no results',
        },
      },
    ])

    // No `0` are showcased as `keepZeroFacets` is set to false
    expect(response2.results[0].facets).toEqual({
      genres: {},
    })
  })

  test('creation of facet distribution when using indexes with sort-by', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY)
    const releaseDateDistribution = {
      release_date: {
        '1065744000': 1,
        '233366400': 1,
        '593395200': 1,
        '750643200': 1,
        '818467200': 1,
        '819676800': 1,
      },
    }
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:asc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:desc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
    ])

    expect(response.results[0].facets).toEqual(releaseDateDistribution)
    expect(response.results[1].facets).toEqual(releaseDateDistribution)
    expect(response.results[2].facets).toEqual(releaseDateDistribution)
  })

  test('creation of facet distribution when using indexes with sort-by and keepZeroFacets', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: true,
    })
    const releaseDateDistribution = {
      release_date: {
        '1065744000': 1,
        '233366400': 1,
        '593395200': 1,
        '750643200': 1,
        '818467200': 1,
        '819676800': 1,
      },
    }
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:asc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:desc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
    ])

    expect(response.results[0].facets).toEqual(releaseDateDistribution)
    expect(response.results[1].facets).toEqual(releaseDateDistribution)
    expect(response.results[2].facets).toEqual(releaseDateDistribution)
  })

  test('creation of facet distribution when using indexes with sort-by and no placeholdersearch', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      placeholderSearch: false,
    })
    const releaseDateDistribution = {
      release_date: {
        '1065744000': 1,
        '233366400': 1,
        '593395200': 1,
        '750643200': 1,
        '818467200': 1,
        '819676800': 1,
      },
    }
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:asc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
      {
        indexName: 'movies:release_date:desc',
        params: {
          facets: ['release_date'],
          query: '',
        },
      },
    ])

    expect(response.results[0].facets).toEqual(releaseDateDistribution)
    expect(response.results[1].facets).toEqual(releaseDateDistribution)
    expect(response.results[2].facets).toEqual(releaseDateDistribution)
  })

  // With facets
  // without keepZeroFacets
  // with placeholderSearch
  // With empty query
  test('creation of facet distribution with facets', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY)
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: '',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({
      genres: {
        Action: 3,
        Adventure: 1,
        Animation: 1,
        Comedy: 2,
        Crime: 4,
        Drama: 1,
        'Science Fiction': 2,
        Thriller: 1,
      },
    })

    const response2 = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: 'no results',
        },
      },
    ])

    // No `0` are showcased as `keepZeroFacets` is set to false
    expect(response2.results[0].facets).toEqual({
      genres: {},
    })
  })

  // With facets
  // with keepZeroFacets
  // with placeholderSearch
  // With multiple search (empty and no results expected)
  test('Ensure cached facetDistribution works between two searches when keepZeroFacets is true', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: true,
    })
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: '',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({
      genres: {
        Action: 3,
        Adventure: 1,
        Animation: 1,
        Comedy: 2,
        Crime: 4,
        Drama: 1,
        'Science Fiction': 2,
        Thriller: 1,
      },
    })

    const response2 = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: 'no results',
        },
      },
    ])

    expect(response2.results[0].facets).toEqual({
      genres: {
        Action: 0,
        Adventure: 0,
        Animation: 0,
        Comedy: 0,
        Crime: 0,
        Drama: 0,
        'Science Fiction': 0,
        Thriller: 0,
      },
    })
  })

  // With facets
  // with keepZeroFacets
  // without placeholderSearch
  // With multiple search (empty and no results expected)
  test('ensure cached facetDistribution works between two calls when placeholderSearch is false', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: true,
      placeholderSearch: false,
    })
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: '',
        },
      },
    ])

    expect(response.results[0].facets).toEqual({
      genres: {
        Action: 3,
        Adventure: 1,
        Animation: 1,
        Comedy: 2,
        Crime: 4,
        Drama: 1,
        'Science Fiction': 2,
        Thriller: 1,
      },
    })
    expect(response.results[0].hits.length).toEqual(0)

    const response2 = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: 'no results',
        },
      },
    ])

    expect(response2.results[0].facets).toEqual({
      genres: {
        Action: 0,
        Adventure: 0,
        Animation: 0,
        Comedy: 0,
        Crime: 0,
        Drama: 0,
        'Science Fiction': 0,
        Thriller: 0,
      },
    })
  })

  // With facets
  // with keepZeroFacets
  // with placeholderSearch
  // Without multiple search
  // Without query expecting no results
  test('creation of facet distribution with facets, keepZeroFacets to true, and query', async () => {
    const { searchClient } = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: true,
    })
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          facets: ['genres'],
          query: 'no results',
        },
      },
    ])
    expect(response.results[0].facets).toEqual({
      genres: {
        Action: 0,
        Adventure: 0,
        Animation: 0,
        Comedy: 0,
        Crime: 0,
        Drama: 0,
        'Science Fiction': 0,
        Thriller: 0,
      },
    })
  })
})
