import {
  AlgoliaMultipleQueriesQuery,
  AlgoliaSearchResponse,
} from '@meilisearch/instant-meilisearch'
import {
  HIGHLIGHT_PRE_TAG,
  HIGHLIGHT_POST_TAG,
  HITS_PER_PAGE,
} from '../constants'
import { SearchClient as MeilisearchSearchClient } from '../types/SearchClient'
import { HighlightResult } from 'instantsearch.js/es/types/algoliasearch'

interface SearchParams {
  /**
   * The initialized Meilisearch search client.
   */
  searchClient: MeilisearchSearchClient
  /**
   * A list of queries to execute.
   */
  queries: Array<
    AlgoliaMultipleQueriesQuery & {
      params?: {
        highlightPreTag?: string
        highlightPostTag?: string
      }
    }
  >
}

interface HighlightMetadata {
  value: string
  fullyHighlighted: boolean
  matchLevel: 'none' | 'partial' | 'full'
  matchedWords: string[]
}

export function fetchMeilisearchResults<TRecord = Record<string, any>>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<AlgoliaSearchResponse<TRecord>>> {
  return searchClient
    .search<TRecord>(
      queries.map((searchParameters) => {
        const { params, ...headers } = searchParameters
        return {
          ...headers,
          params: {
            hitsPerPage: HITS_PER_PAGE,
            highlightPreTag: HIGHLIGHT_PRE_TAG,
            highlightPostTag: HIGHLIGHT_POST_TAG,
            ...params,
          },
        }
      })
    )
    .then(
      (response: Awaited<ReturnType<typeof searchClient.search<TRecord>>>) => {
        return response.results.map(
          (
            result: AlgoliaSearchResponse<TRecord>,
            resultsArrayIndex: number
          ) => {
            const query = queries[resultsArrayIndex]
            return {
              ...result,
              hits: result.hits.map((hit) => ({
                ...hit,
                _highlightResult: (
                  Object.entries(hit?._highlightResult || {}) as Array<
                    | [keyof TRecord, { value: string }]
                    | [keyof TRecord, Array<{ value: string }>] // if the field is an array
                  >
                ).reduce((acc, [field, highlightResult]) => {
                  // if the field is an array, highlightResult is an array of objects
                  if (Array.isArray(highlightResult)) {
                    return {
                      ...acc,
                      [field]: highlightResult.map((highlight) =>
                        calculateHighlightMetadata(
                          highlight.value,
                          query.params?.highlightPreTag || HIGHLIGHT_PRE_TAG,
                          query.params?.highlightPostTag || HIGHLIGHT_POST_TAG
                        )
                      ),
                    }
                  }
                  return {
                    ...acc,
                    [field]: calculateHighlightMetadata(
                      highlightResult.value,
                      query.params?.highlightPreTag || HIGHLIGHT_PRE_TAG,
                      query.params?.highlightPostTag || HIGHLIGHT_POST_TAG
                    ),
                  }
                }, {} as HighlightResult<TRecord>),
              })),
            }
          }
        )
      }
    )
}

function calculateHighlightMetadata(
  value: string,
  preTag: string,
  postTag: string
): HighlightMetadata {
  // Extract all highlighted segments
  const highlightRegex = new RegExp(`${preTag}(.*?)${postTag}`, 'g')
  const matches: string[] = []
  let match
  while ((match = highlightRegex.exec(value)) !== null) {
    matches.push(match[1])
  }

  // Remove highlight tags to get the original, unhighlighted text
  const cleanValue = value.replace(new RegExp(`${preTag}|${postTag}`, 'g'), '')

  // Determine if the entire attribute is highlighted
  // fullyHighlighted = true if cleanValue and the concatenation of all matched segments are identical
  const highlightedText = matches.join('')
  const fullyHighlighted = cleanValue === highlightedText

  // Determine match level:
  // - 'none' if no matches
  // - 'partial' if some matches but not fully highlighted
  // - 'full' if all text is fully highlighted
  let matchLevel: 'none' | 'partial' | 'full' = 'none'
  if (matches.length > 0) {
    matchLevel = fullyHighlighted ? 'full' : 'partial'
  }

  return {
    value,
    fullyHighlighted,
    matchLevel,
    matchedWords: matches,
  }
}
