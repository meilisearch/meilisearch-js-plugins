import {
  searchClient,
  dataset,
  Movies,
  meilisearchClient,
} from './assets/utils'

describe('Sort browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient.index('movies').updateSettings({
      sortableAttributes: ['release_date', 'title'],
    })

    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('sort-by one fields', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies:release_date:desc',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
  })

  test('sort-by mutiple fields', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies:release_date:desc,title:asc',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
  })
})
