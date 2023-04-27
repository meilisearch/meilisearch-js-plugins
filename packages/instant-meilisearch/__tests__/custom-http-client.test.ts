import { instantMeiliSearch } from '../src'
import { meilisearchClient, dataset } from './assets/utils'

describe('Custom HTTP client tests', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)

    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('a custom HTTP client', async () => {
    const httpClient = jest.fn(async (url: string, init?: RequestInit) => {
      const result = await fetch(url, init)
      return await result.json()
    })

    const searchClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        httpClient,
      }
    )

    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          attributesToRetrieve: [],
          query: 'ariel',
        },
      },
    ])
    expect(httpClient).toHaveBeenCalledTimes(2)
    expect(response.results[0].hits.length).toEqual(1)
  })
})
