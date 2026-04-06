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
import { calculateHighlightMetadata } from './highlight.js'

const MAX_HIGHLIGHT_DEPTH = 20

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
  const queryStr = query.query || ''
  const preTag = query.params?.highlightPreTag || HIGHLIGHT_PRE_TAG
  const postTag = query.params?.highlightPostTag || HIGHLIGHT_POST_TAG

  return result.hits.map((hit) => {
    const enrichedHit: any = {
      ...hit,
      _highlightResult: Object.entries(hit?._highlightResult || {}).reduce(
        (acc, [field, highlightResult]) => {
          if (
            !shouldIncludeTopLevelHighlightField(
              highlightResult,
              preTag,
              postTag
            )
          ) {
            return acc
          }
          acc[field] = enrichHighlightTree(
            highlightResult,
            queryStr,
            preTag,
            postTag,
            0
          )
          return acc
        },
        {} as Record<string, unknown>
      ),
    }

    // Attach metadata to each hit if present (for Meilisearch Cloud Analytics)
    if ((result as any)._meilisearch?.metadata) {
      enrichedHit._meilisearch = {
        metadata: (result as any)._meilisearch.metadata,
      }
    }

    return enrichedHit
  })
}

type DefinedHighlightResult = { value: string } | Array<{ value: string }>

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

function shouldIncludeTopLevelHighlightField(
  input: unknown,
  preTag: string,
  postTag: string
): boolean {
  if (input === null || input === undefined) {
    return false
  }
  if (isDefinedHighlightValue(input as PossibleHighlightResult)) {
    return true
  }
  if (!preTag || !postTag) {
    return false
  }
  return highlightTreeContainsMarkers(input, preTag, postTag, 0)
}

function highlightTreeContainsMarkers(
  input: unknown,
  preTag: string,
  postTag: string,
  depth: number
): boolean {
  if (depth > MAX_HIGHLIGHT_DEPTH) {
    return false
  }
  if (input === null || input === undefined) {
    return false
  }
  if (Array.isArray(input)) {
    return input.some((item) =>
      highlightTreeContainsMarkers(item, preTag, postTag, depth + 1)
    )
  }
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (typeof obj.value === 'string') {
      return obj.value.includes(preTag) && obj.value.includes(postTag)
    }
    return Object.values(obj).some((v) =>
      highlightTreeContainsMarkers(v, preTag, postTag, depth + 1)
    )
  }
  return false
}

function enrichHighlightTree(
  input: unknown,
  query: string,
  preTag: string,
  postTag: string,
  depth: number
): unknown {
  if (depth > MAX_HIGHLIGHT_DEPTH) {
    return input
  }

  if (input === null || input === undefined) {
    return input
  }

  if (Array.isArray(input)) {
    return input.map((item) =>
      enrichHighlightTree(item, query, preTag, postTag, depth + 1)
    )
  }

  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (typeof obj.value === 'string') {
      const meta = calculateHighlightMetadata(query, preTag, postTag, obj.value)
      return { ...obj, ...meta }
    }
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = enrichHighlightTree(v, query, preTag, postTag, depth + 1)
    }
    return out
  }

  return input
}
