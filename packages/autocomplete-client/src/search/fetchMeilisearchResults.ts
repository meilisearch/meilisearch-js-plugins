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
import { calculateHighlightMetadata } from './highlight'
import { mapOneOrMany } from '../utils'

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

export function fetchMeilisearchResults<TRecord = Record<string, any>>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<AlgoliaSearchResponse<TRecord>>> {
  return searchClient
    .search<TRecord>(buildSearchRequest(queries))
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
              hits: buildHits<TRecord>(result, query),
            }
          }
        )
      }
    )
}

function buildSearchRequest(queries: AlgoliaMultipleQueriesQuery[]) {
  return queries.map((searchParameters) => {
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
}

function buildHits<TRecord>(
  result: AlgoliaSearchResponse<TRecord>,
  query: AlgoliaMultipleQueriesQuery
) {
  return result.hits.map((hit) => ({
    ...hit,
    _highlightResult: (
      Object.entries(hit?._highlightResult || {}) as Array<
        | [keyof TRecord, { value: string }]
        | [keyof TRecord, Array<{ value: string }>] // if the field is an array
      >
    ).reduce((acc, [field, highlightResult]) => {
      return {
        ...acc,
        // if the field is an array, highlightResult is an array of objects
        [field]: mapOneOrMany(highlightResult, (highlightResult) =>
          calculateHighlightMetadata(
            query.query || '',
            query.params?.highlightPreTag || HIGHLIGHT_PRE_TAG,
            query.params?.highlightPostTag || HIGHLIGHT_POST_TAG,
            highlightResult.value
          )
        ),
      }
    }, {} as HighlightResult<TRecord>),
  }))
}
