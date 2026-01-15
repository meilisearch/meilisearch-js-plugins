import { describe, test, expect } from 'vitest'
import {
  getItemMetadata,
  buildAnalyticsEvent,
  type MeilisearchAutocompleteItem,
} from '../analytics.js'
import type { MeilisearchSearchMetadata } from '@meilisearch/instant-meilisearch'

describe('getItemMetadata', () => {
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

    const result = getItemMetadata(item)
    expect(result).toEqual(metadata)
  })

  test('returns undefined when metadata is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '1',
      title: 'Test Movie',
    }

    const result = getItemMetadata(item)
    expect(result).toBeUndefined()
  })

  test('returns undefined when _meilisearch is present but metadata is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '1',
      title: 'Test Movie',
      _meilisearch: {},
    }

    const result = getItemMetadata(item)
    expect(result).toBeUndefined()
  })
})

describe('buildAnalyticsEvent', () => {
  const mockMetadata: MeilisearchSearchMetadata = {
    queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
    indexUid: 'movies',
    primaryKey: 'id',
  }

  test('builds event payload with objectID', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '123',
      title: 'Test Movie',
      objectID: '123',
      __position: 1,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      item,
    })

    expect(event).toEqual({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      indexUid: 'movies',
      queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
      objectId: '123',
      position: 1,
    })
  })

  test('builds event payload with userId when provided', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '123',
      title: 'Test Movie',
      objectID: '123',
      __position: 1,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      item,
      userId: 'user-456',
    })

    expect(event.userId).toEqual('user-456')
  })

  test('resolves objectId from primaryKey field when objectID is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '789',
      title: 'Test Movie',
      __position: 2,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      item,
    })

    expect(event.objectId).toEqual('789')
    expect(event.position).toEqual(2)
  })

  test('prefers objectID over primaryKey field', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '999',
      title: 'Test Movie',
      objectID: '123',
      __position: 3,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      item,
    })

    expect(event.objectId).toEqual('123') // objectID, not id
  })

  test('converts numeric primaryKey field to string', () => {
    const item: MeilisearchAutocompleteItem = {
      id: 456,
      title: 'Test Movie',
      __position: 1,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'click',
      eventName: 'Search Result Clicked',
      item,
    })

    expect(event.objectId).toEqual('456')
    expect(typeof event.objectId).toBe('string')
  })

  test('throws when metadata is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '123',
      objectID: '123',
      __position: 1,
    }

    expect(() => {
      buildAnalyticsEvent({
        eventType: 'click',
        eventName: 'Search Result Clicked',
        item,
      })
    }).toThrow(/missing _meilisearch\.metadata/)
  })

  test('throws when queryUid is missing from metadata', () => {
    const incompleteMetadata = {
      indexUid: 'movies',
      primaryKey: 'id',
    } as MeilisearchSearchMetadata

    const item: MeilisearchAutocompleteItem = {
      id: '123',
      objectID: '123',
      __position: 1,
      _meilisearch: { metadata: incompleteMetadata },
    }

    expect(() => {
      buildAnalyticsEvent({
        eventType: 'click',
        eventName: 'Search Result Clicked',
        item,
      })
    }).toThrow(/missing required fields/)
  })

  test('throws when indexUid is missing from metadata', () => {
    const incompleteMetadata = {
      queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
      primaryKey: 'id',
    } as MeilisearchSearchMetadata

    const item: MeilisearchAutocompleteItem = {
      id: '123',
      objectID: '123',
      __position: 1,
      _meilisearch: { metadata: incompleteMetadata },
    }

    expect(() => {
      buildAnalyticsEvent({
        eventType: 'click',
        eventName: 'Search Result Clicked',
        item,
      })
    }).toThrow(/missing required fields/)
  })

  test('throws when __position is missing', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '123',
      objectID: '123',
      _meilisearch: { metadata: mockMetadata },
    }

    expect(() => {
      buildAnalyticsEvent({
        eventType: 'click',
        eventName: 'Search Result Clicked',
        item,
      })
    }).toThrow(/missing __position/)
  })

  test('throws when objectId cannot be resolved', () => {
    const metadataWithoutPrimaryKey = {
      queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
      indexUid: 'movies',
    }

    const item: MeilisearchAutocompleteItem = {
      title: 'Test Movie',
      __position: 1,
      _meilisearch: { metadata: metadataWithoutPrimaryKey },
    }

    expect(() => {
      buildAnalyticsEvent({
        eventType: 'click',
        eventName: 'Search Result Clicked',
        item,
      })
    }).toThrow(/could not resolve objectId/)
  })

  test('builds conversion event payload', () => {
    const item: MeilisearchAutocompleteItem = {
      id: '123',
      title: 'Test Movie',
      objectID: '123',
      __position: 5,
      _meilisearch: { metadata: mockMetadata },
    }

    const event = buildAnalyticsEvent({
      eventType: 'conversion',
      eventName: 'Product Purchased',
      item,
      userId: 'user-789',
    })

    expect(event).toEqual({
      eventType: 'conversion',
      eventName: 'Product Purchased',
      indexUid: 'movies',
      queryUid: '0199a41a-8186-70b3-b6e1-90e8cb582f35',
      objectId: '123',
      position: 5,
      userId: 'user-789',
    })
  })
})
