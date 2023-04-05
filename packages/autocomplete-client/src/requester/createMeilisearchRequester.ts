import { fetchMeilisearchResults } from '../search'

import { createRequester } from './createRequester'

// Algolia provides an user-agent through here
export const createMeilisearchRequester = createRequester(
  // Here you can add additional things if you want ?
  (params) => fetchMeilisearchResults(params),
  'meilisearch'
)
