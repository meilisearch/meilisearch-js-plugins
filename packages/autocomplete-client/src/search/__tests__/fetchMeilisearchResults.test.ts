import { fetchMeilisearchResults } from '../fetchMeilisearchResults'
import { searchClient, dataset } from '../../../__tests__/test.utils'
import { MeiliSearch } from 'meilisearch'

beforeAll(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  const task = await client.index('testUid').addDocuments(dataset)
  await client.waitForTask(task.taskUid)
})

describe('fetchMeilisearchResults', () => {
  test('with default options', async () => {
    const results = await fetchMeilisearchResults<(typeof dataset)[0]>({
      searchClient,
      queries: [
        {
          indexName: 'testUid',
          query: '',
        },
      ],
    })

    expect(results[0].hits[0].id).toEqual(1)
    expect(results[0].hits[1].id).toEqual(2)
  })

  test('with custom search parameters', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: 'testUid',
          query: 'Hit',
          params: {
            hitsPerPage: 1,
            highlightPreTag: '<test>',
            highlightPostTag: '</test>',
            page: 1,
          },
        },
      ],
    })

    expect(results[0].hits[0].id).toEqual(2)
    expect(results[0].hits[0]._highlightResult).toEqual({
      id: { value: '2' },
      label: { value: '<test>Hit</test> 2' },
    })
  })
})
