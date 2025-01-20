import { describe, test, expect } from 'vitest'
import { getMeilisearchResults } from '../index.js'
import { searchClient } from '../../../__tests__/test.utils.js'

describe('getMeilisearchResults', () => {
  test('the the fields in the returned description object', () => {
    const description = getMeilisearchResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
        {
          indexName: 'indexName2',
          query: 'query',
        },
      ],
    })

    expect(description).toEqual({
      execute: expect.any(Function),
      requesterId: 'meilisearch',
      transformResponse: expect.any(Function),
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
        {
          indexName: 'indexName2',
          query: 'query',
        },
      ],
    })
  })

  test('the default transformItems method on the retrieved hits', () => {
    const description = getMeilisearchResults<{ label: string }>({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    })

    const transformedResponse = description.transformResponse({
      results: [],
      hits: [
        [
          {
            objectID: '1',
            label: 'Label',
            _highlightResult: {
              label: { value: 'Label', matchLevel: 'none', matchedWords: [] },
            },
          },
        ],
      ],
      facetHits: [],
    })

    expect(transformedResponse).toEqual([
      [
        {
          objectID: '1',
          label: 'Label',
          _highlightResult: {
            label: { value: 'Label', matchLevel: 'none', matchedWords: [] },
          },
        },
      ],
    ])
  })
})
