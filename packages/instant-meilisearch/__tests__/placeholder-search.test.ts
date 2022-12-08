import { instantMeiliSearch } from '../src'
import { dataset, Movies, meilisearchClient } from './assets/utils'

describe('Pagination browser test', () => {
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

  test('placeholdersearch set to true', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        placeholderSearch: true,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(6)
  })

  test('placeholdersearch set to false', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        placeholderSearch: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(0)
  })

  test('placeholdersearch with query', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        placeholderSearch: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'a',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBeGreaterThan(0)
  })

  test('placeholdersearch set to false with filter', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        placeholderSearch: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: ['genres:Action'],
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBeGreaterThan(0)
  })
})
