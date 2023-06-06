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
        return response.results
      }
    )
}
