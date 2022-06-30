import { instantMeiliSearch } from '../src'
import {
  searchClient,
  dataset,
  Movies,
  meilisearchClient,
} from './assets/utils'

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

  test('Test placeholdersearch set to false', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        paginationTotalHits: 5,
        placeholderSearch: true,
      }
    )
    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toBe(5)
  })

  test('Test placeholdersearch set to true', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        paginationTotalHits: 5,
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
})
