import { meilisearchClient, getMeilisearchResults } from '../src'
import { MeiliSearch } from 'meilisearch'
import { basicClient } from './test.utils'
import products from './assets/products.json'

console.log(meilisearchClient)
export const searchResponse = {
  hits: [],
  query: '',
  offset: 0,
  limit: 0,
  processingTimeMs: 0,
  estimatedTotalHits: 0,
  exhaustiveNbHits: false,
}

beforeAll(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  const task = await client.index('products').addDocuments(products)
  await client.waitForTask(task.taskUid)
})
describe('Autocomplete search client tests', () => {
  afterEach(() => {})

  test('Creating the requester', () => {
    const query = {
      indexName: 'products',
      query: 'test',
      params: {
        hitsPerPage: 10,
        attributesToSnippet: ['name:10', 'description:35'],
        snippetEllipsisText: '…',
      },
    }
    const requester = getMeilisearchResults({
      searchClient: basicClient,
      queries: [query],
    })

    expect(Object.keys(requester)).toEqual([
      'requesterId',
      'execute',
      'transformResponse',
      'searchClient',
      'queries',
    ])
    expect(requester.queries).toEqual([query])
  })

  test('Search with the request', async () => {
    const query = {
      indexName: 'products',
      query: 'test',
      params: {
        hitsPerPage: 5,
        attributesToSnippet: ['name:10', 'description:35'],
        snippetEllipsisText: '…',
      },
    }
    const requester = getMeilisearchResults({
      searchClient: basicClient,
      queries: [query],
    })

    // const a = requester.searchClient.search([{ indexName: }])
    console.log(requester.queries)
    expect(Object.keys(requester)).toEqual([
      'requesterId',
      'execute',
      'transformResponse',
      'searchClient',
      'queries',
    ])
    expect(requester.queries).toEqual([query])
  })
})
