import { searchClient, dataset } from './assets/utils'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await searchClient.MeiliSearchClient.deleteIndex(
      'movies'
    )
    await searchClient.MeiliSearchClient.waitForTask(deleteTask.uid)
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['genres'])
    const documentsTask = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForTask(
      documentsTask.uid
    )
  })

  test('Test empty array on facetsDistribution', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: [],
        },
      },
    ])
    expect(response.results[0].facets?.genres).toEqual(undefined)
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
    expect(response.results[0].facets?.genres?.Action).toEqual(3)
  })
})
