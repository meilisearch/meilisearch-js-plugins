import { describe, beforeAll, test, expect, afterAll } from 'vitest'
import { fetchMeilisearchResults } from '../fetchMeilisearchResults.js'
import {
  searchClient,
  MOVIES,
  meilisearchClient,
} from '../../../__tests__/test.utils.js'
import { type HighlightMetadata } from '../highlight.js'

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

  test('highlight results skips attributes missing value key', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'kill bill',
        },
      ],
    })

    expect(results[0].hits[0]._highlightResult?.reviews).toEqual(undefined)
  })

  test('attaches metadata to each hit when present in result', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: 'Ariel',
        },
      ],
    })

    // If metadata is present in the result, it should be on each hit
    const firstResult = results[0] as any
    if (firstResult._meilisearch?.metadata) {
      const firstHit = results[0].hits[0] as any
      expect(firstHit._meilisearch).toBeDefined()
      expect(firstHit._meilisearch.metadata).toBeDefined()
      expect(firstHit._meilisearch.metadata.queryUid).toBeDefined()
      expect(firstHit._meilisearch.metadata.indexUid).toEqual(INDEX_NAME)
    }
  })

  test('does not add metadata field when not present in result', async () => {
    const results = await fetchMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: INDEX_NAME,
          query: '',
        },
      ],
    })

    const firstResult = results[0] as any
    // Only check hits if result doesn't have metadata
    if (!firstResult._meilisearch?.metadata) {
      const firstHit = results[0].hits[0] as any
      expect(firstHit._meilisearch).toBeUndefined()
    }
  })

  describe('Highlighting Metadata', () => {
    interface Person {
      id: number
      name: string
      nicknames: string[]
      familyMembers: Array<{
        relationship: string
        name: string
      }>
      crew?: Array<{ role: string; credit: string }>
    }

    interface PersonHighlightResult {
      id: HighlightMetadata
      name: HighlightMetadata
      nicknames: HighlightMetadata[]
      familyMembers: Array<{
        relationship: HighlightMetadata
        name: HighlightMetadata
      }>
      crew?: Array<{
        role: HighlightMetadata
        credit: HighlightMetadata
      }>
    }

    const PERSON: Person = {
      id: 1,
      name: 'Joseph',
      nicknames: ['Joe', 'Joey'],
      familyMembers: [
        {
          relationship: 'mother',
          name: 'Susan',
        },
        {
          relationship: 'father',
          name: 'John',
        },
      ],
      crew: [
        { role: 'director', credit: 'Neo' },
        { role: 'producer', credit: 'Trinity' },
      ],
    }
    const PEOPLE_INDEX = 'people_highlight_test'

    beforeAll(async () => {
      await meilisearchClient.deleteIndex(PEOPLE_INDEX)
      await meilisearchClient
        .index(PEOPLE_INDEX)
        .addDocuments([PERSON])
        .waitTask()
    })

    afterAll(async () => {
      await meilisearchClient.deleteIndex(PEOPLE_INDEX)
    })

    describe('Recursive Enrichment', () => {
      test('enriches simple string arrays with metadata', async () => {
        const pre = '<em>'
        const post = '</em>'
        const results = await fetchMeilisearchResults<Person>({
          searchClient,
          queries: [
            {
              indexName: PEOPLE_INDEX,
              query: 'Joe',
              params: {
                highlightPreTag: pre,
                highlightPostTag: post,
              },
            },
          ],
        })

        const highlightResult = results[0].hits[0]
          ._highlightResult as PersonHighlightResult
        expect(highlightResult.nicknames[0]).toEqual({
          value: `${pre}Joe${post}`,
          fullyHighlighted: true,
          matchLevel: 'full',
          matchedWords: ['Joe'],
        })
      })

      test('recursively enriches objects nested inside arrays', async () => {
        const pre = '<em>'
        const post = '</em>'
        const results = await fetchMeilisearchResults<Person>({
          searchClient,
          queries: [
            {
              indexName: PEOPLE_INDEX,
              query: 'Susan',
              params: {
                highlightPreTag: pre,
                highlightPostTag: post,
              },
            },
          ],
        })

        const highlightResult = results[0].hits[0]
          ._highlightResult as PersonHighlightResult
        expect(highlightResult.familyMembers[0].name).toEqual({
          value: `${pre}Susan${post}`,
          fullyHighlighted: true,
          matchLevel: 'full',
          matchedWords: ['Susan'],
        })
      })

      test('handles multiple highlighted fields within the same nested object', async () => {
        const pre = '<em>'
        const post = '</em>'
        const results = await fetchMeilisearchResults<Person>({
          searchClient,
          queries: [
            {
              indexName: PEOPLE_INDEX,
              query: 'mother',
              params: {
                highlightPreTag: pre,
                highlightPostTag: post,
              },
            },
          ],
        })

        const highlightResult = results[0].hits[0]
          ._highlightResult as PersonHighlightResult
        expect(highlightResult.familyMembers[0].relationship).toEqual({
          value: `${pre}mother${post}`,
          fullyHighlighted: true,
          matchLevel: 'full',
          matchedWords: ['mother'],
        })
      })

      test('preserves the original structure for non-matching nested fields', async () => {
        const pre = '<em>'
        const post = '</em>'
        const results = await fetchMeilisearchResults<Person>({
          searchClient,
          queries: [
            {
              indexName: PEOPLE_INDEX,
              query: 'Neo',
              params: {
                highlightPreTag: pre,
                highlightPostTag: post,
              },
            },
          ],
        })

        const highlightResult = results[0].hits[0]
          ._highlightResult as PersonHighlightResult

        expect(highlightResult.crew).toBeDefined()
        expect(highlightResult.crew).toHaveLength(2)
        expect(highlightResult.crew![0].credit).toEqual({
          value: `${pre}Neo${post}`,
          fullyHighlighted: true,
          matchLevel: 'full',
          matchedWords: ['Neo'],
        })
        expect(highlightResult.crew![1].credit).toEqual({
          value: 'Trinity',
          fullyHighlighted: false,
          matchLevel: 'none',
          matchedWords: [],
        })
      })
    })

    describe('Match Logic', () => {
      test('performs case-insensitive matchLevel validation', async () => {
        const pre = '<em>'
        const post = '</em>'
        const results = await fetchMeilisearchResults<Person>({
          searchClient,
          queries: [
            {
              indexName: PEOPLE_INDEX,
              query: 'joseph',
              params: {
                highlightPreTag: pre,
                highlightPostTag: post,
              },
            },
          ],
        })

        const highlightResult = results[0].hits[0]
          ._highlightResult as PersonHighlightResult

        expect(highlightResult.name).toEqual({
          value: `${pre}Joseph${post}`,
          fullyHighlighted: true,
          matchLevel: 'full',
          matchedWords: ['Joseph'],
        })
      })
    })
  })
})
