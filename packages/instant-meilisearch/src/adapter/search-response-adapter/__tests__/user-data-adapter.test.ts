import { describe, test, expect } from 'vitest'
import {
  adaptSearchResult,
  adaptSearchResults,
} from '../search-response-adapter.js'

const baseResponse = {
  indexUid: 'products',
  hits: [
    {
      id: '1',
      title: 'Mechanical Keyboard',
    },
  ],
  query: 'keyboard',
  processingTimeMs: 4,
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

describe('userData forwarding in search-response-adapter', () => {
  test('should forward userData unchanged when present on Meilisearch response', () => {
    const userData = [{ redirect: 'https://example.com/keyboards' }]
    const adaptedResult = adaptSearchResult(
      { ...baseResponse, userData },
      {},
      config
    )

    expect(adaptedResult.userData).toEqual(userData)
    expect(adaptedResult.userData).toBe(userData)
  })

  test('should omit userData when undefined on Meilisearch response', () => {
    const adaptedResult = adaptSearchResult(baseResponse, {}, config)

    expect('userData' in adaptedResult).toBe(false)
    expect(adaptedResult.userData).toBeUndefined()
  })

  test('should preserve explicit falsy userData values when defined', () => {
    const emptyArrayResult = adaptSearchResult(
      { ...baseResponse, userData: [] },
      {},
      config
    )
    const nullResult = adaptSearchResult(
      { ...baseResponse, userData: null },
      {},
      config
    )

    expect(emptyArrayResult.userData).toEqual([])
    expect(nullResult.userData).toBeNull()
  })

  test('should forward userData per result in adaptSearchResults', () => {
    const redirectPayload = [{ redirect: '/collections/sale' }]
    const { results } = adaptSearchResults(
      [
        { ...baseResponse, indexUid: 'products', userData: redirectPayload },
        { ...baseResponse, indexUid: 'articles' },
      ],
      {},
      config
    )

    expect(results).toHaveLength(2)
    expect(results[0].userData).toEqual(redirectPayload)
    expect('userData' in results[1]).toBe(false)
  })
})
