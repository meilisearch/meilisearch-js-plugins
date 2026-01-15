import type { MeilisearchSearchMetadata } from '@meilisearch/instant-meilisearch'

/**
 * Autocomplete item type that includes Meilisearch analytics fields
 */
export interface MeilisearchAutocompleteItem<T = Record<string, any>> extends Record<string, any> {
  objectID?: string
  __position?: number
  _meilisearch?: {
    metadata?: MeilisearchSearchMetadata
  }
}

/**
 * Event payload for Meilisearch Cloud Analytics /events endpoint
 */
export interface AnalyticsEventPayload {
  eventType: string
  eventName: string
  indexUid: string
  queryUid: string
  objectId: string
  position: number
  userId?: string
}

/**
 * Options for building an analytics event
 */
export interface BuildAnalyticsEventOptions {
  eventType: string
  eventName: string
  item: MeilisearchAutocompleteItem
  userId?: string
}

/**
 * Get Meilisearch metadata from an Autocomplete item.
 *
 * @param item - The Autocomplete item (hit)
 * @returns The metadata object, or undefined if not present
 *
 * @example
 * ```ts
 * const metadata = getItemMetadata(item)
 * if (metadata) {
 *   console.log('Query UID:', metadata.queryUid)
 * }
 * ```
 */
export function getItemMetadata(
  item: MeilisearchAutocompleteItem
): MeilisearchSearchMetadata | undefined {
  return item._meilisearch?.metadata
}

/**
 * Build an analytics event payload for the Meilisearch Cloud Analytics /events endpoint.
 *
 * This helper resolves the required fields from an Autocomplete item:
 * - `indexUid`, `queryUid`, `primaryKey` from `item._meilisearch.metadata`
 * - `position` from `item.__position`
 * - `objectId` from `item.objectID` (preferred) or `item[metadata.primaryKey]`
 *
 * @param options - Event options including eventType, eventName, item, and optional userId
 * @returns The event payload ready to send to the /events endpoint
 * @throws Error if required metadata or fields are missing
 *
 * @example
 * ```ts
 * // In an Autocomplete onSelect callback:
 * onSelect({ item }) {
 *   const event = buildAnalyticsEvent({
 *     eventType: 'click',
 *     eventName: 'Search Result Clicked',
 *     item,
 *     userId: 'user-123'
 *   })
 *   
 *   fetch('https://your-instance.meilisearch.io/events', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(event)
 *   })
 * }
 * ```
 */
export function buildAnalyticsEvent(
  options: BuildAnalyticsEventOptions
): AnalyticsEventPayload {
  const { eventType, eventName, item, userId } = options

  // Get metadata
  const metadata = getItemMetadata(item)
  if (!metadata) {
    throw new Error(
      'Cannot build analytics event: item is missing _meilisearch.metadata. ' +
      'Ensure search metadata is enabled (on Meilisearch Cloud it is enabled by default, ' +
      'on self-hosted instances set the "Meili-Include-Metadata: true" header).'
    )
  }

  const { queryUid, indexUid, primaryKey } = metadata

  if (!queryUid || !indexUid) {
    throw new Error(
      'Cannot build analytics event: metadata is missing required fields (queryUid or indexUid).'
    )
  }

  // Get position
  const position = item.__position
  if (typeof position !== 'number') {
    throw new Error(
      'Cannot build analytics event: item is missing __position. ' +
      'Ensure you are using a version of @meilisearch/instant-meilisearch that injects __position on hits.'
    )
  }

  // Resolve objectId
  let objectId: string | undefined = item.objectID

  // Fallback to primaryKey field if objectID is missing
  if (!objectId && primaryKey) {
    const fieldValue = item[primaryKey]
    objectId = fieldValue != null ? String(fieldValue) : undefined
  }

  if (!objectId) {
    throw new Error(
      'Cannot build analytics event: could not resolve objectId from item. ' +
      'Ensure your items have an objectID field or configure a primaryKey.'
    )
  }

  const payload: AnalyticsEventPayload = {
    eventType,
    eventName,
    indexUid,
    queryUid,
    objectId,
    position,
  }

  if (userId) {
    payload.userId = userId
  }

  return payload
}
