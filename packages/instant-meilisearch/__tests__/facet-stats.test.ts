import { describe, beforeAll, test, expect } from 'vitest'
import { searchClient, dataset, meilisearchClient } from './assets/utils.js'

describe('Facet stats tests', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres', 'release_date', 'id'])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('Facet stats on an empty facets array', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: [],
        },
      },
    ])

    expect(response.results[0].facets_stats?.release_date).toEqual(undefined)
  })

  test('Facet stats on a facet with no numeric values', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: ['genres'],
        },
      },
    ])

    expect(response.results[0].facets_stats?.genres).toEqual(undefined)
  })

  test('Facet stats on two facet', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: ['release_date', 'id'],
        },
      },
    ])

    expect(response.results[0].facets_stats?.release_date).toEqual({
      avg: 0,
      max: 1065744000,
      min: 233366400,
      sum: 0,
    })
    expect(response.results[0].facets_stats?.id).toEqual({
      avg: 0,
      max: 30,
      min: 2,
      sum: 0,
    })
  })
})
