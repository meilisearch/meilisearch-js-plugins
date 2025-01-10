import type {
  AlgoliaMultipleQueriesQuery,
  AlgoliaSearchResponse,
} from '@meilisearch/instant-meilisearch'
import {
  HIGHLIGHT_PRE_TAG,
  HIGHLIGHT_POST_TAG,
  HITS_PER_PAGE,
} from '../constants/index.js'
import type { SearchClient as MeilisearchSearchClient } from '../types/SearchClient.js'
import { FieldHighlight } from 'instantsearch.js/es/types/algoliasearch'
import { calculateHighlightMetadata } from './highlight.js'
import { mapOneOrMany } from '../utils.js'

interface SearchParams {
  /** The initialized Meilisearch search client. */
  searchClient: MeilisearchSearchClient
  /** A list of queries to execute. */
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
              hits: result.hits.map((hit) => {
                const enrichedHit: any = {
                  ...hit,
                  _highlightResult: (
                    Object.entries(hit?._highlightResult || {}) as Array<
                      [keyof TRecord, PossibleHighlightResult]
                    >
                  ).reduce((acc, [field, highlightResult]) => {
                    if (!isDefinedHighlightValue(highlightResult)) {
                      return acc
                    }

                    // if the field is an array, highlightResult is an array of objects
                    acc[field] = mapOneOrMany(
                      highlightResult,
                      (highlightResult) => {
                        return calculateHighlightMetadata(
                          query.query || '',
                          query.params?.highlightPreTag || HIGHLIGHT_PRE_TAG,
                          query.params?.highlightPostTag || HIGHLIGHT_POST_TAG,
                          highlightResult.value
                        )
                      }
                    )

                    return acc
                  }, {} as FieldHighlight<TRecord>),
                }

                // Attach metadata to each hit if present (for Meilisearch Cloud Analytics)
                if ((result as any)._meilisearch?.metadata) {
                  enrichedHit._meilisearch = {
                    metadata: (result as any)._meilisearch.metadata,
                  }
                }

                return enrichedHit
              }),
            }
          }
        )
      }
    )
}

type DefinedHighlightResult = { value: string } | Array<{ value: string }>

/**
 * Some fields may not return a value at all - nested arrays/objects for example
 *
 * Ideally server honours the `attributesToHighlight` param and only includes
 * those attributes in the response rather than all attributes (highlighted or
 * not)
 */
type UndefinedHighlightResult = { value?: never } | Array<{ value?: never }>

type PossibleHighlightResult = DefinedHighlightResult | UndefinedHighlightResult

function isDefinedHighlightValue(
  input: PossibleHighlightResult
): input is DefinedHighlightResult {
  if (Array.isArray(input)) {
    return input.every((r) => typeof r.value === 'string')
  }

  return typeof input.value === 'string'
}
