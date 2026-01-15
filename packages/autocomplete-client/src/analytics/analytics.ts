import type { MeilisearchSearchMetadata } from '@meilisearch/instant-meilisearch'

/** Autocomplete item type that includes Meilisearch analytics fields */
export type MeilisearchAutocompleteItem<
  T extends Record<string, any> = Record<string, any>,
> = T & {
  objectID?: string
  __position?: number
  _meilisearch?: {
    metadata?: MeilisearchSearchMetadata
  }
}

/**
 * Get Meilisearch metadata from an Autocomplete item.
 *
 * @example
 *
 * ```ts
 * const metadata = getItemAnalyticsMetadata(item)
 * if (metadata) {
 *   console.log('Query UID:', metadata.queryUid)
 * }
 * ```
 *
 * @param item - The Autocomplete item (hit)
 * @returns The metadata object, or undefined if not present
 */
export function getItemAnalyticsMetadata<
  T extends Record<string, any> = Record<string, any>,
>(item: MeilisearchAutocompleteItem<T>): MeilisearchSearchMetadata | undefined {
  return item._meilisearch?.metadata
}
