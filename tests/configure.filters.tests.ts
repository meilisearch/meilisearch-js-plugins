import { searchClient, dataset, Movies } from './assets/utils'

describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test('Test multiple filters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          filters:
            'title = "Four Rooms" OR title = "Ariel" AND release_date > 593395200',
          query: '',
        },
      },
    ])

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Four Rooms')
  })

  test('Test empty', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          filters: '',
          query: '',
        },
      },
    ])

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
  })

  test('Test multiple filters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          filters: 'title = "Four Rooms" OR title = "Ariel"',
          numericFilters: ['release_date > 593395200'],
          query: '',
        },
      },
    ])

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Four Rooms')
  })

  test('Only numeric filters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          filters: 'title = "Four Rooms" OR title = "Ariel"',
          numericFilters: ['release_date > 593395200'],
          query: '',
        },
      },
    ])

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Four Rooms')
  })
})
