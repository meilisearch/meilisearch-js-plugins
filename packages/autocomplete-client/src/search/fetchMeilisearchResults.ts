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

interface SearchParams {
  /**
   * The initialized Meilisearch search client.
   */
  searchClient: MeilisearchSearchClient
  /**
   * A list of queries to execute.
   */
  queries: AlgoliaMultipleQueriesQuery[]
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
          (result: AlgoliaSearchResponse<TRecord>) => ({
            ...result,
            hits: result.hits.map(
              (hit: AlgoliaSearchResponse<TRecord>['hits'][number]) => ({
                ...hit,
                _highlightResult: hit._highlightResult
                  ? Object.entries(hit._highlightResult).reduce(
                      (acc, [key, value]) => ({
                        ...acc,
                        [key]: calculateHighlightMetadata(value.value),
                      }),
                      {}
                    )
                  : {},
              })
            ),
          })
        )
      }
    )
}

function calculateHighlightMetadata(
  value: string,
  preTag: string = HIGHLIGHT_PRE_TAG,
  postTag: string = HIGHLIGHT_POST_TAG
): HighlightMetadata {
  // Find all highlighted words
  const highlightRegex = new RegExp(`${preTag}(.*?)${postTag}`, 'g')
  const matches: string[] = []
  let match
  while ((match = highlightRegex.exec(value)) !== null) {
    matches.push(match[1])
  }
  const matchedWords = matches

  // Remove highlight tags for comparison
  const cleanValue = value.replace(new RegExp(`${preTag}|${postTag}`, 'g'), '')

  // Calculate if fully highlighted
  const highlightedText = matches.join('')
  const fullyHighlighted = cleanValue === highlightedText

  // Determine match level
  let matchLevel: 'none' | 'partial' | 'full' = 'none'
  if (matches.length > 0) {
    matchLevel = fullyHighlighted ? 'full' : 'partial'
  }

  return {
    value,
    fullyHighlighted,
    matchLevel,
    matchedWords,
  }
}
