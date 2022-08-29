import { dataset, meilisearchClient, HOST, API_KEY } from './assets/utils'
import { instantMeiliSearch } from '../src'

describe('Firt facet distribution', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('creation of facet distribution without facets', async () => {
    const searchClient = instantMeiliSearch(HOST, API_KEY)
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

  test('creation of facet distribution without facets and with keepZeroFacets to true', async () => {
    const searchClient = instantMeiliSearch(HOST, API_KEY, {
      keepZeroFacets: false,
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

  test('creation of facet distribution with facets', async () => {
    const searchClient = instantMeiliSearch(HOST, API_KEY)
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
  })

  test('creation of facet distribution with facets and keepZeroFacets to true', async () => {
    const searchClient = instantMeiliSearch(HOST, API_KEY, {
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

  test('creation of facet distribution with facets, keepZeroFacets to true, and query', async () => {
    const searchClient = instantMeiliSearch(HOST, API_KEY, {
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
