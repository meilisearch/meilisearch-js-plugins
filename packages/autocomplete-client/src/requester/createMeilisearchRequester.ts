import { fetchMeilisearchResults } from '../search'

import { createRequester } from './createRequester'

export const createMeilisearchRequester = createRequester(
  fetchMeilisearchResults,
  'meilisearch'
)
