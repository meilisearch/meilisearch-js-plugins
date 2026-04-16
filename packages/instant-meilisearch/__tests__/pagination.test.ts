import { describe, beforeAll, test, expect } from 'vitest'
import {
  searchClient,
  dataset,
  type Movies,
  meilisearchClient,
} from './assets/utils.js'

describe('Pagination browser test', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
      .waitTask()
    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
  })

  test('1 hitsPerPage', async () => {
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

  test('1 hitsPerPage w/ page 0 ', async () => {
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

  test('1 hitsPerPage w/ page 1 ', async () => {
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

  test('100 hitsPerPage w/ page 1 ', async () => {
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

  test('0 hitsPerPage w/ page 0 ', async () => {
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
