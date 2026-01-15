import { describe, test, expect } from 'vitest'
import { adaptSearchResult } from '../search-response-adapter.js'

const searchResponseWithMetadata = {
  indexUid: 'movies',
  hits: [
    {
      id: '1',
      title: 'Test Movie',
    },
  ],
  query: 'test',
  processingTimeMs: 5,
  hitsPerPage: 20,
  page: 0,
  totalPages: 1,
  totalHits: 1,
  facetDistribution: {},
  facetStats: {},
  pagination: {
    hitsPerPage: 20,
    page: 0,
    finite: true,
  },
  metadata: {
    queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
    indexUid: 'movies',
    primaryKey: 'id',
  },
}

const searchResponseWithoutMetadata = {
  indexUid: 'movies',
  hits: [
    {
      id: '1',
      title: 'Test Movie',
    },
  ],
  query: 'test',
  processingTimeMs: 5,
  hitsPerPage: 20,
  page: 0,
  totalPages: 1,
  totalHits: 1,
  facetDistribution: {},
  facetStats: {},
  pagination: {
    hitsPerPage: 20,
    page: 0,
    finite: true,
  },
}

const config = {
  placeholderSearch: true,
  keepZeroFacets: false,
  clientAgents: [],
  finitePagination: true,
}

describe('Metadata adapter', () => {
  test('should preserve metadata under _meilisearch namespace when present in Meilisearch response', () => {
    const adaptedResult = adaptSearchResult(
      searchResponseWithMetadata,
      {},
      config
    )

    expect(adaptedResult._meilisearch).toBeDefined()
    expect(adaptedResult._meilisearch?.metadata).toBeDefined()
    expect(adaptedResult._meilisearch?.metadata.queryUid).toBe(
      '0199a41a-8186-70b3-b6e1-90e8cb582f35'
    )
    expect(adaptedResult._meilisearch?.metadata.indexUid).toBe('movies')
    expect(adaptedResult._meilisearch?.metadata.primaryKey).toBe('id')
  })

  test('should not add _meilisearch field when metadata not present in Meilisearch response', () => {
    const adaptedResult = adaptSearchResult(
      searchResponseWithoutMetadata,
      {},
      config
    )

    expect(adaptedResult._meilisearch).toBeUndefined()
  })

  test('adapted result should still contain standard InstantSearch fields', () => {
    const adaptedResult = adaptSearchResult(
      searchResponseWithMetadata,
      {},
      config
    )

    // Verify standard InstantSearch/Algolia fields are still present
    expect(adaptedResult.index).toBe('movies')
    expect(adaptedResult.query).toBe('test')
    expect(adaptedResult.hits).toHaveLength(1)
    expect(adaptedResult.hitsPerPage).toBe(20)
    expect(adaptedResult.page).toBe(0)
    expect(adaptedResult.nbPages).toBe(1)
    expect(adaptedResult.nbHits).toBe(1)
    expect(adaptedResult.processingTimeMS).toBe(5)
    expect(adaptedResult.params).toBe('')
    expect(adaptedResult.exhaustiveNbHits).toBe(false)
  })
})
