import { fetchMeilisearchResults } from '../search/index.js'

import { createRequester } from './createRequester.js'

export const createMeilisearchRequester = createRequester(
  (params) => fetchMeilisearchResults(params),
  'meilisearch'
)
