import { describe, beforeAll, test, expect } from 'vitest'
import { searchClient, dataset, meilisearchClient } from './assets/utils.js'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
      .waitTask()
    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
  })

  test('empty array on facetDistribution', async () => {
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

  test('one facet on facetDistribution', async () => {
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
