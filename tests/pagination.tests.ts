import { searchClient, dataset } from './assets/utils'

describe('Pagination browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['genres'])
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test('Test 1 hitsPerPage', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
    expect(hits[0].title).toBe('Star Wars')
  })

  test('Test 1 hitsPerPage w/ page 0 ', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 1,
          page: 0,
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
    expect(hits[0].title).toBe('Star Wars')
  })

  test('Test 1 hitsPerPage w/ page 1 ', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 1,
          page: 1,
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
    expect(hits[0].title).toBe('Ariel')
  })

  test('Test 100 hitsPerPage w/ page 1 ', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 100,
          page: 1,
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(0)
    expect(hits).toEqual([])
  })

  test('Test 0 hitsPerPage w/ page 0 ', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 0,
          page: 0,
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(0)
    expect(hits).toEqual([])
  })
})
