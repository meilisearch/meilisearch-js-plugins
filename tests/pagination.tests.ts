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

  test('Test 1 hitsPerPage', async () => {
    const response = await searchClient.search<Movies>([
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
  })

  test('Test 1 hitsPerPage w/ page 0 ', async () => {
    const response = await searchClient.search<Movies>([
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
  })

  test('Test 1 hitsPerPage w/ page 1 ', async () => {
    const response = await searchClient.search<Movies>([
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
  })

  test('Test 100 hitsPerPage w/ page 1 ', async () => {
    const response = await searchClient.search<Movies>([
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
    const response = await searchClient.search<Movies>([
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
