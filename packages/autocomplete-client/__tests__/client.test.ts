import { searchClient, getMeilisearchResults } from '../src'
import {
  autocomplete,
  // AutocompleteComponents,
  // getAlgoliaResults,
  // getMeilisearchResults,
} from '@algolia/autocomplete-js'

console.log(searchClient)
export const searchResponse = {
  hits: [],
  query: '',
  offset: 0,
  limit: 0,
  processingTimeMs: 0,
  estimatedTotalHits: 0,
  exhaustiveNbHits: false,
}

describe('Autocomplete search client tests', () => {
  afterEach(() => {})

  test('the same search parameters twice', async () => {
    console.log(searchClient)
    console.log(getMeilisearchResults)
  })
})
