import { describe, test, expect } from 'vitest'
import {
  getItemAnalyticsMetadata,
  type MeilisearchAutocompleteItem,
} from '../analytics.js'
import type { MeilisearchSearchMetadata } from '@meilisearch/instant-meilisearch'

describe('getItemAnalyticsMetadata', () => {
  test('returns metadata when present on item', () => {
    const metadata: MeilisearchSearchMetadata = {
      queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
      indexUid: 'movies',
      primaryKey: 'id',
    }

    const item: MeilisearchAutocompleteItem = {
      id: '1',
      title: 'Test Movie',
      _meilisearch: { metadata },
    }

    const result = getItemAnalyticsMetadata(item)
    expect(result).toEqual(metadata)
  })

  test('returns undefined when metadata is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '1',
      title: 'Test Movie',
    }

    const result = getItemAnalyticsMetadata(item)
    expect(result).toBeUndefined()
  })

  test('returns undefined when _meilisearch is present but metadata is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '1',
      title: 'Test Movie',
      _meilisearch: {},
    }

    const result = getItemAnalyticsMetadata(item)
    expect(result).toBeUndefined()
  })
})
