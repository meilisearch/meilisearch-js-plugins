import { meilisearchAutocompleteClient } from '../src'
import { MeiliSearch } from 'meilisearch'

const dataset = [
  { id: 1, label: 'Hit 1' },
  { id: 2, label: 'Hit 2' },
]
const HOST = 'http://localhost:7700'
const API_KEY = 'masterKey'
const searchClient = meilisearchAutocompleteClient({
  url: HOST,
  apiKey: API_KEY,
})

const meilisearchClient = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
})

export { HOST, API_KEY, searchClient, dataset, meilisearchClient }
