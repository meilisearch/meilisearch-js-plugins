import { fetchMeilisearchResults } from '../fetchMeilisearchResults'
import {
  searchClient,
  dataset,
  meilisearchClient,
} from '../../../__tests__/test.utils'
import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../../constants'

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
            // TODO: this is not tested for
            highlightPreTag: '<test>',
            highlightPostTag: '</test>',
            page: 1,
          },
        },
      ],
    })

    expect(results[0].hits[0].id).toEqual(2)
  })

  test('with highlighting metadata', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: 'testUid',
          query: 'Hit',
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult).toEqual({
      id: {
        value: '1',
        fullyHighlighted: false,
        matchLevel: 'none',
        matchedWords: [],
      },
      label: {
        value: `${HIGHLIGHT_PRE_TAG}Hit${HIGHLIGHT_POST_TAG} 1`,
        fullyHighlighted: false,
        matchLevel: 'partial',
        matchedWords: ['Hit'],
      },
    })
  })

  test('with fully highlighted match', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: 'testUid',
          query: 'Hit',
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.label).toEqual({
      value: `${HIGHLIGHT_PRE_TAG}Hit${HIGHLIGHT_POST_TAG} ${HIGHLIGHT_PRE_TAG}2${HIGHLIGHT_POST_TAG}`,
      fullyHighlighted: true,
      matchLevel: 'partial',
      matchedWords: ['Hit'],
    })
  })
})
