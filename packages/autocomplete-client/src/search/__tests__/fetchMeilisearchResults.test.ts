import { fetchMeilisearchResults } from '../fetchMeilisearchResults'
import {
  searchClient,
  dataset,
  meilisearchClient,
} from '../../../__tests__/test.utils'

beforeAll(async () => {
  await meilisearchClient.deleteIndex('testUid')
  const task = await meilisearchClient.index('testUid').addDocuments(dataset)
  await meilisearchClient.waitForTask(task.taskUid)
})

afterAll(async () => {
  await meilisearchClient.deleteIndex('testUid')
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
