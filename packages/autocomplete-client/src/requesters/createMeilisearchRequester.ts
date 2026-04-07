import { fetchMeilisearchResults } from '../search/index.ts'

import { createRequester } from './createRequester.ts'

export const createMeilisearchRequester = createRequester(
  (params) => fetchMeilisearchResults(params),
  'meilisearch'
)
