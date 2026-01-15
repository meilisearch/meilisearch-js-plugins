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
 * Get Meilisearch metadata from an Autocomplete item.
 *
 * @param item - The Autocomplete item (hit)
 * @returns The metadata object, or undefined if not present
 *
 * @example
 * ```ts
 * const metadata = getItemAnalyticsMetadata(item)
 * if (metadata) {
 *   console.log('Query UID:', metadata.queryUid)
 * }
 * ```
 */
export function getItemAnalyticsMetadata(
  item: MeilisearchAutocompleteItem
): MeilisearchSearchMetadata | undefined {
  return item._meilisearch?.metadata
}
