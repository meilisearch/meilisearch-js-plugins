import { searchClient, dataset } from './assets/utils'

describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateAttributesForFaceting(['genres'])
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test('Test one facet on facetsFilters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facetFilters: ['genres:action'],
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toEqual(2)
  })

  test('Test multiple on facetsFilters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facetFilters: ['genres:action', 'genres:Thriller', 'genres:crime'],
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toEqual(1)
  })

  test('Test multiple on facetsFilters', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facetFilters: ['genres:action', 'genres:Thriller', 'genres:crime'],
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toEqual(1)
  })

  test('Test one facet on facetsDistribution', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: ['genres'],
        },
      },
    ])
    console.log(response.results[0])
    // console.log(response.results[0].hits)
    // expect(response.results[0].facets.genres).toEqual(1)
  })
})
