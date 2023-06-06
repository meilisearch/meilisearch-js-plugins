import { fetchMeilisearchResults } from '../search'

import { createRequester } from './createRequester'

export const createMeilisearchRequester = createRequester(
  (params) => fetchMeilisearchResults(params),
  'meilisearch'
)
