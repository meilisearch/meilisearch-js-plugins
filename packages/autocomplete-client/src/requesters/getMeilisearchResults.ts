import { createMeilisearchRequester } from './createMeilisearchRequester'

/**
 * Retrieves Meilisearch results from multiple indices.
 */
export const getMeilisearchResults = createMeilisearchRequester({
  transformResponse: (response) => response.hits,
})
