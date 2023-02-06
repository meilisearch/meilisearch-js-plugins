import { createMeilisearchRequester } from './createMeilisearchRequester'

/**
 * Retrieves Algolia results from multiple indices.
 */
export const getMeilisearchResults = createMeilisearchRequester({
  transformResponse: (response) => response.hits,
})
