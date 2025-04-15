import { describe, beforeAll, test, expect, afterAll } from 'vitest'
import { fetchMeilisearchResults } from '../fetchMeilisearchResults.js'
import {
  searchClient,
  MOVIES,
  meilisearchClient,
} from '../../../__tests__/test.utils.js'

type Movie = (typeof MOVIES)[number]

const INDEX_NAME = 'movies_fetch-meilisearch-results-test'
const FIRST_ITEM_ID = MOVIES[0].id
const SECOND_ITEM_ID = MOVIES[1].id

beforeAll(async () => {
  await meilisearchClient.deleteIndex(INDEX_NAME)
  await meilisearchClient.index(INDEX_NAME).addDocuments(MOVIES).waitTask()
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

    expect(results[0].hits[0].id).toEqual(FIRST_ITEM_ID)
    expect(results[0].hits[1].id).toEqual(SECOND_ITEM_ID)
  })

  test('with custom pagination', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: '',
          params: {
            hitsPerPage: 1,
            page: 1, // pages start at 0
          },
        },
      ],
    })

    expect(results[0].hits[0].id).toEqual(SECOND_ITEM_ID)
  })

  test('with custom highlight tags', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Ariel',
          params: {
            highlightPreTag: '<b>',
            highlightPostTag: '</b>',
          },
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.title?.value).toEqual(
      '<b>Ariel</b>'
    )
  })

  test('highlight results contain highlighting metadata', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Ariel',
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.id?.fullyHighlighted).toEqual(
      false
    )
    expect(results[0].hits[0]._highlightResult?.id?.matchLevel).toEqual('none')
    expect(results[0].hits[0]._highlightResult?.id?.matchedWords).toEqual([])
    expect(results[0].hits[0]._highlightResult?.id?.value).toEqual(String(2))
  })

  test('highlight results contain fully highlighted match', async () => {
    const pre = '<em>'
    const post = '</em>'
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Ariel',
          params: {
            highlightPreTag: pre,
            highlightPostTag: post,
          },
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.title).toEqual({
      value: `${pre}Ariel${post}`,
      fullyHighlighted: true,
      matchLevel: 'full',
      matchedWords: ['Ariel'],
    })
  })

  test('highlight results contains full match but not fully highlighted', async () => {
    const pre = '<em>'
    const post = '</em>'
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Star',
          params: {
            highlightPreTag: pre,
            highlightPostTag: post,
          },
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.title).toEqual({
      value: `${pre}Star${post} Wars`,
      fullyHighlighted: false,
      matchLevel: 'full',
      matchedWords: ['Star'],
    })
  })

  test('highlight results contain partially highlighted match', async () => {
    const pre = '<em>'
    const post = '</em>'
    const movie = MOVIES[0]
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Tasto', // missing 'i' from 'Taisto'
          params: {
            highlightPreTag: pre,
            highlightPostTag: post,
          },
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.overview).toEqual({
      // The first word of the overview is highlighted
      value: `${pre}Taist${post}` + (movie.overview as string).slice(5),
      fullyHighlighted: false,
      matchLevel: 'partial',
      matchedWords: ['Taist'],
    })
  })

  test('highlight results contain no match', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [{ indexName: INDEX_NAME, query: '' }],
    })

    expect(results[0].hits[0]._highlightResult?.title).toEqual({
      value: 'Ariel',
      fullyHighlighted: false,
      matchLevel: 'none',
      matchedWords: [],
    })
  })
})
