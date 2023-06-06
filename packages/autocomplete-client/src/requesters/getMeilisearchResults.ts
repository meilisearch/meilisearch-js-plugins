import { createMeilisearchRequester } from './createMeilisearchRequester'

/**
 * Retrieves Meilisearch results from multiple indexes.
 */
export const getMeilisearchResults = createMeilisearchRequester({
  transformResponse: (response) => response.hits,
})
