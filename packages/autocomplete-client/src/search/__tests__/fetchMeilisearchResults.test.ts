import { fetchMeilisearchResults } from '../fetchMeilisearchResults'
import {
  searchClient,
  MOVIES,
  meilisearchClient,
} from '../../../__tests__/test.utils'
import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../../constants'

type Movie = (typeof MOVIES)[number]
const INDEX_NAME = 'movies'

beforeAll(async () => {
  await meilisearchClient.deleteIndex(INDEX_NAME)
  const task = await meilisearchClient.index(INDEX_NAME).addDocuments(MOVIES)
  await meilisearchClient.waitForTask(task.taskUid)
})

afterAll(async () => {
  await meilisearchClient.deleteIndex(INDEX_NAME)
})

describe('fetchMeilisearchResults', () => {
  test('with default options', async () => {
    const results = await fetchMeilisearchResults<Movie>({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: '',
        },
      ],
    })

    expect(results[0].hits[0].id).toEqual(1)
    expect(results[0].hits[1].id).toEqual(2)
  })

  // test('with custom pagination', async () => {
  //   const results = await fetchMeilisearchResults({
  //     searchClient,
  //     queries: [
  //       {
  //         indexName: INDEX_NAME,
  //         query: 'Hit',
  //         params: {
  //           hitsPerPage: 1,
  //           page: 1,
  //         },
  //       },
  //     ],
  //   })

  //   expect(results[0].hits[0].id).toEqual(2)
  // })

  // test('with custom highlight tags', async () => {
  //   const results = await fetchMeilisearchResults({
  //     searchClient,
  //     queries: [
  //       {
  //         indexName: INDEX_NAME,
  //         query: 'Hit',
  //         params: {
  //           highlightPreTag: '<b>',
  //           highlightPostTag: '</b>',
  //         },
  //       },
  //     ],
  //   })

  //   expect(results[0].hits[0]._highlightResult?.label?.value).toEqual(
  //     '<b>Hit</b> 1'
  //   )
  // })

  // test('with highlighting metadata', async () => {
  //   const results = await fetchMeilisearchResults({
  //     searchClient,
  //     queries: [
  //       {
  //         indexName: INDEX_NAME,
  //         query: 'Hit',
  //       },
  //     ],
  //   })

  //   expect(results[0].hits[0]._highlightResult).toEqual({
  //     id: {
  //       value: '1',
  //       fullyHighlighted: false,
  //       matchLevel: 'none',
  //       matchedWords: [],
  //     },
  //     label: {
  //       value: `${HIGHLIGHT_PRE_TAG}Hit${HIGHLIGHT_POST_TAG} 1`,
  //       fullyHighlighted: false,
  //       matchLevel: 'partial',
  //       matchedWords: ['Hit'],
  //     },
  //   })
  // })

  // test('with fully highlighted match', async () => {
  //   const pre = '<em>'
  //   const post = '</em>'
  //   const results = await fetchMeilisearchResults({
  //     searchClient,
  //     queries: [
  //       {
  //         indexName: INDEX_NAME,
  //         query: 'Hit 1',
  //         params: {
  //           highlightPreTag: pre,
  //           highlightPostTag: post,
  //         },
  //       },
  //     ],
  //   })

  //   expect(results[0].hits[0]._highlightResult?.label).toEqual({
  //     value: `${pre}Hit${post} ${pre}1${post}`,
  //     fullyHighlighted: true,
  //     matchLevel: 'full',
  //     matchedWords: ['Hit'],
  //   })
  // })
})
