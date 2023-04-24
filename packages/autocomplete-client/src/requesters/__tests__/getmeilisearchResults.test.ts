import { getMeilisearchResults } from '../'
import { searchClient } from '../../../__tests__/test.utils'

describe('getMeilisearchResults', () => {
  test('returns the description', () => {
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

  test('defaults transformItems to retrieve hits', () => {
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
