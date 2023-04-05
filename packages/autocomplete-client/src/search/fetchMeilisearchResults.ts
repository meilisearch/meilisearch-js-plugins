// import {
//   userAgents as coreUserAgents,
//   UserAgent,
// } from '@algolia/autocomplete-shared'

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants'
// import type {
//   AlgoliaMultipleQueriesQuery,
//   SearchForFacetValuesResponse,
//   SearchResponse,
//   SearchClient,
// } from '../types'

import {
  AlgoliaMultipleQueriesQuery,
  AlgoliaSearchResponse,
  AlgoliaSearchForFacetValuesResponse,
  InstantMeiliSearchInstance,
} from '@meilisearch/instant-meilisearch'

interface SearchParams {
  /**
   * The initialized Algolia search client.
   */
  searchClient: InstantMeiliSearchInstance
  /**
   * A list of queries to execute.
   */
  queries: AlgoliaMultipleQueriesQuery[]
  /**
   * A list of user agents to add to the search client.
   *
   * This is useful to track usage of an integration.
   */
  // userAgents?: UserAgent[]
}

export function fetchMeilisearchResults<TRecord>({
  searchClient,
  queries,
}: SearchParams): Promise<
  Array<AlgoliaSearchResponse<TRecord> | AlgoliaSearchForFacetValuesResponse>
> {
  console.log('SEARCH')
  // TODO: adapt to im
  // if (typeof searchClient.addAlgoliaAgent === 'function') {
  //   const algoliaAgents: UserAgent[] = [...coreUserAgents, ...userAgents];

  //   algoliaAgents.forEach(({ segment, version }) => {
  //     searchClient.addAlgoliaAgent(segment, version);
  //   });
  // }

  return searchClient
    .search<TRecord>(
      queries.map((searchParameters) => {
        console.log(searchParameters)
        const { params, ...headers } = searchParameters

        return {
          ...headers,
          params: {
            hitsPerPage: 5,
            highlightPreTag: HIGHLIGHT_PRE_TAG,
            highlightPostTag: HIGHLIGHT_POST_TAG,
            ...params,
          },
        }
      })
    )
    .then((response) => {
      return response.results
    })
}
