import { describe, beforeAll, test, expect } from 'vitest'
import { instantMeiliSearch, getAnalyticsMetadata } from '../src/index.js'
import { dataset, type Movies, meilisearchClient } from './assets/utils.js'

describe('Search metadata integration tests', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
  })

  test('metadata is present when Meili-Include-Metadata header is set', async () => {
    const { searchClient } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        requestInit: {
          headers: {
            'Meili-Include-Metadata': 'true',
          },
        },
      }
    )

    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'a',
        },
      },
    ])

    const result = response.results[0]

    // Check that metadata is present under _meilisearch namespace
    expect(result._meilisearch).toBeDefined()
    expect(result._meilisearch?.metadata).toBeDefined()

    // Check that metadata properties are present
    const metadata = result._meilisearch?.metadata
    expect(metadata?.queryUid).toBeTruthy()
    expect(metadata?.indexUid).toBe('movies')
    expect(metadata?.primaryKey).toBeTruthy()
  })

  test('metadata is accessible via getAnalyticsMetadata helper', async () => {
    const { searchClient } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        requestInit: {
          headers: {
            'Meili-Include-Metadata': 'true',
          },
        },
      }
    )

    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'star',
        },
      },
    ])

    // Create a results object compatible with getAnalyticsMetadata
    // (mimics InstantSearch's helper.lastResults structure)
    const resultsWithRawResults = {
      _rawResults: response.results,
    }

    // Use the helper function to get metadata
    const metadata = getAnalyticsMetadata(resultsWithRawResults, {
      indexUid: 'movies',
    })

    expect(metadata).toBeDefined()
    expect(metadata?.queryUid).toBeTruthy()
    expect(metadata?.indexUid).toBe('movies')
    expect(metadata?.primaryKey).toBeTruthy()

    // Verify it's the same as what's in _meilisearch
    expect(metadata).toEqual(response.results[0]._meilisearch?.metadata)
  })

  test('metadata is not present when header is not set', async () => {
    const { searchClient } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'a',
        },
      },
    ])

    const result = response.results[0]

    // Metadata should not be present without the header
    expect(result._meilisearch).toBeUndefined()
  })

  test('getAnalyticsMetadata returns undefined when metadata is not present', async () => {
    const { searchClient } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'a',
        },
      },
    ])

    // Create a results object compatible with getAnalyticsMetadata
    const resultsWithRawResults = {
      _rawResults: response.results,
    }

    // Use the helper function when metadata is not present
    const metadata = getAnalyticsMetadata(resultsWithRawResults, {
      indexUid: 'movies',
    })

    expect(metadata).toBeUndefined()
  })
})
