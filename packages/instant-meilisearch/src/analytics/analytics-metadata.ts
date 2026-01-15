import type {
  MeilisearchSearchMetadata,
  MeilisearchSearchResponse,
} from '../types/index.js'

/**
 * Get Meilisearch metadata for a specific index from InstantSearch results.
 *
 * @param results - The InstantSearch results object containing _rawResults
 * @param options - Options object with indexUid to select a specific index
 * @returns The metadata for the specified index, or undefined if not found
 *
 * @example
 * ```ts
 * // Get metadata for a specific index
 * const metadata = getAnalyticsMetadata(results, { indexUid: 'movies' })
 * if (metadata) {
 *   console.log(metadata.queryUid)
 * }
 * ```
 */
export function getAnalyticsMetadata(
  results: { _rawResults?: MeilisearchSearchResponse[] },
  options: { indexUid: string }
): MeilisearchSearchMetadata | undefined

/**
 * Get all Meilisearch metadata from InstantSearch results.
 *
 * @param results - The InstantSearch results object containing _rawResults
 * @returns An array of metadata objects from all raw results
 *
 * @example
 * ```ts
 * // Get metadata for all indexes
 * const allMetadata = getAnalyticsMetadata(results)
 * allMetadata.forEach(metadata => {
 *   console.log(`${metadata.indexUid}: ${metadata.queryUid}`)
 * })
 * ```
 */
export function getAnalyticsMetadata(
  results: { _rawResults?: MeilisearchSearchResponse[] }
): MeilisearchSearchMetadata[]

/**
 * Implementation
 */
export function getAnalyticsMetadata(
  results: { _rawResults?: MeilisearchSearchResponse[] },
  options?: { indexUid: string }
):
  | MeilisearchSearchMetadata
  | undefined
  | MeilisearchSearchMetadata[] {
  if (!results?._rawResults) {
    return options ? undefined : []
  }

  if (options?.indexUid) {
    // Find the specific index
    const rawResult = results._rawResults.find(
      (raw) => raw.index === options.indexUid
    )
    return rawResult?._meilisearch?.metadata
  }

  // Return all metadata
  return results._rawResults
    .map((raw) => raw._meilisearch?.metadata)
    .filter((metadata): metadata is MeilisearchSearchMetadata => !!metadata)
}
