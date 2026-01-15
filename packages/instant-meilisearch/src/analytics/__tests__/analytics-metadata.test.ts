import { describe, test, expect } from 'vitest'
import { getAnalyticsMetadata } from '../analytics-metadata.js'
import type {
  MeilisearchSearchResponse,
  MeilisearchSearchMetadata,
} from '../../types/index.js'

describe('getAnalyticsMetadata', () => {
  const metadata1: MeilisearchSearchMetadata = {
    queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
    indexUid: 'movies',
    primaryKey: 'id',
  }

  const metadata2: MeilisearchSearchMetadata = {
    queryUid: '0299b52b-9297-81c4-c7f2-01f9dc693f46',
    indexUid: 'games',
    primaryKey: 'game_id',
  }

  const mockResultsWithMetadata = {
    _rawResults: [
      {
        index: 'movies',
        _meilisearch: { metadata: metadata1 },
        hits: [],
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 10,
        query: 'test',
        processingTimeMS: 5,
        exhaustiveNbHits: false,
        params: '',
      },
      {
        index: 'games',
        _meilisearch: { metadata: metadata2 },
        hits: [],
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 5,
        query: 'test',
        processingTimeMS: 5,
        exhaustiveNbHits: false,
        params: '',
      },
    ] as MeilisearchSearchResponse[],
  }

  const mockResultsWithoutMetadata = {
    _rawResults: [
      {
        index: 'movies',
        hits: [],
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 10,
        query: 'test',
        processingTimeMS: 5,
        exhaustiveNbHits: false,
        params: '',
      },
    ] as MeilisearchSearchResponse[],
  }

  const mockResultsPartialMetadata = {
    _rawResults: [
      {
        index: 'movies',
        _meilisearch: { metadata: metadata1 },
        hits: [],
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 10,
        query: 'test',
        processingTimeMS: 5,
        exhaustiveNbHits: false,
        params: '',
      },
      {
        index: 'games',
        hits: [],
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 5,
        query: 'test',
        processingTimeMS: 5,
        exhaustiveNbHits: false,
        params: '',
      },
    ] as MeilisearchSearchResponse[],
  }

  describe('with indexUid option (single index retrieval)', () => {
    test('should return metadata for a specific index', () => {
      const metadata = getAnalyticsMetadata(mockResultsWithMetadata, {
        indexUid: 'movies',
      })

      expect(metadata).toBeDefined()
      expect(metadata?.queryUid).toBe('0199a41a-8186-70b3-b6e1-90e8cb582f35')
      expect(metadata?.indexUid).toBe('movies')
      expect(metadata?.primaryKey).toBe('id')
    })

    test('should return metadata for second index', () => {
      const metadata = getAnalyticsMetadata(mockResultsWithMetadata, {
        indexUid: 'games',
      })

      expect(metadata).toBeDefined()
      expect(metadata?.queryUid).toBe('0299b52b-9297-81c4-c7f2-01f9dc693f46')
      expect(metadata?.indexUid).toBe('games')
      expect(metadata?.primaryKey).toBe('game_id')
    })

    test('should return undefined for non-existent index', () => {
      const metadata = getAnalyticsMetadata(mockResultsWithMetadata, {
        indexUid: 'nonexistent',
      })

      expect(metadata).toBeUndefined()
    })

    test('should return undefined when index has no metadata', () => {
      const metadata = getAnalyticsMetadata(mockResultsWithoutMetadata, {
        indexUid: 'movies',
      })

      expect(metadata).toBeUndefined()
    })

    test('should return undefined when _rawResults is missing', () => {
      const metadata = getAnalyticsMetadata({}, { indexUid: 'movies' })

      expect(metadata).toBeUndefined()
    })

    test('should return undefined when _rawResults is undefined', () => {
      const metadata = getAnalyticsMetadata(
        { _rawResults: undefined },
        { indexUid: 'movies' }
      )

      expect(metadata).toBeUndefined()
    })
  })

  describe('without indexUid option (all indexes retrieval)', () => {
    test('should return all metadata from all indexes', () => {
      const allMetadata = getAnalyticsMetadata(mockResultsWithMetadata)

      expect(allMetadata).toHaveLength(2)
      expect(allMetadata[0]).toEqual(metadata1)
      expect(allMetadata[1]).toEqual(metadata2)
    })

    test('should return empty array when no metadata present', () => {
      const allMetadata = getAnalyticsMetadata(mockResultsWithoutMetadata)

      expect(allMetadata).toEqual([])
    })

    test('should filter out indexes without metadata', () => {
      const allMetadata = getAnalyticsMetadata(mockResultsPartialMetadata)

      expect(allMetadata).toHaveLength(1)
      expect(allMetadata[0]).toEqual(metadata1)
    })

    test('should return empty array when _rawResults is missing', () => {
      const allMetadata = getAnalyticsMetadata({})

      expect(allMetadata).toEqual([])
    })

    test('should return empty array when _rawResults is undefined', () => {
      const allMetadata = getAnalyticsMetadata({ _rawResults: undefined })

      expect(allMetadata).toEqual([])
    })
  })
})
