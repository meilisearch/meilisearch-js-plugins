import { fetchMeilisearchResults } from '../search'
import {
  AlgoliaMultipleQueriesQuery,
  AlgoliaSearchResponse,
  AlgoliaSearchForFacetValuesResponse,
} from '@meilisearch/instant-meilisearch'
import { SearchClient as MeilisearchClient } from '../types/SearchClient'

// All types copied from: autocomplete/packages/autocomplete-preset-algolia/src/requester/createRequester.ts
// As most of the types are not exported and we need to be able to provide our own Fetcher

type Fetcher = typeof fetchMeilisearchResults

export type FetcherParams = Pick<
  Parameters<Fetcher>[0],
  'searchClient' | 'queries'
>

type FacetHit = {
  label: string
  count: number
  _highlightResult: {
    label: {
      value: string
    }
  }
}
type TransformResponseParams<THit> = {
  results: Array<
    AlgoliaSearchResponse<THit> | AlgoliaSearchForFacetValuesResponse
  >
  hits: Array<AlgoliaSearchResponse<THit>['hits']>
  facetHits: FacetHit[][]
}

export type TransformedRequesterResponse<THit> =
  | Array<AlgoliaSearchResponse<THit>['hits']>
  | AlgoliaSearchResponse<THit>['hits']
  | FacetHit[][]
  | FacetHit[]

export type TransformResponse<THit> = (
  response: TransformResponseParams<THit>
) => TransformedRequesterResponse<THit>

export type RequesterParams<THit> = {
  transformResponse(
    response: TransformResponseParams<THit>
  ): TransformedRequesterResponse<THit>
}

type FetcherParamsQuery<THit> = {
  query: AlgoliaMultipleQueriesQuery
  sourceId: string
  transformResponse: TransformResponse<THit>
}

type ExecuteParams<THit> = {
  searchClient: MeilisearchClient
  requests: Array<FetcherParamsQuery<THit>>
}

export type ExecuteResponse<THit> = Array<{
  items: AlgoliaSearchResponse<THit> | AlgoliaSearchForFacetValuesResponse
  sourceId: string
  transformResponse: TransformResponse<THit>
}>

export type Execute<THit> = (
  params: ExecuteParams<THit>
) => Promise<ExecuteResponse<THit>>

export type RequestParams<THit> = FetcherParams & {
  /**
   * The function to transform the Algolia response before passing it to the Autocomplete state. You have access to the full Algolia results, as well as the pre-computed hits and facet hits.
   *
   * This is useful to manipulate the hits, or store data from the results in the [context](https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/context/).
   */
  transformResponse?: TransformResponse<THit>
}

export type RequesterDescription<THit> = {
  /**
   * The search client used for this request. Multiple queries with the same client are batched (if `requesterId` is also the same).
   */
  searchClient: any
  /**
   * Identifies requesters to confirm their queries should be batched.
   * This ensures that requesters with the same client but different
   * post-processing functions don't get batched.
   * When falsy, batching is disabled.
   * For example, the Algolia requesters use "algolia".
   */
  requesterId?: string
  /**
   * The search parameters used for this query.
   */
  queries: AlgoliaMultipleQueriesQuery[]
  /**
   * Transforms the response of this search before returning it to the caller.
   */
  transformResponse: TransformResponse<THit>
  /**
   * Post-processing function for multi-queries.
   */
  execute: Execute<THit>
}

export function createRequester(fetcher: Fetcher, requesterId?: string) {
  function execute<THit>(fetcherParams: ExecuteParams<THit>) {
    return fetcher<THit>({
      searchClient: fetcherParams.searchClient,
      queries: fetcherParams.requests.map((x) => x.query),
    }).then((responses) =>
      responses.map((response, index) => {
        const { sourceId, transformResponse } = fetcherParams.requests[index]

        return {
          items: response,
          sourceId,
          transformResponse,
        }
      })
    )
  }

  return function createSpecifiedRequester(
    requesterParams: RequesterParams<any>
  ) {
    return function requester<TTHit>(
      requestParams: RequestParams<TTHit>
    ): RequesterDescription<TTHit> {
      return {
        requesterId,
        execute,
        ...requesterParams,
        ...requestParams,
      }
    }
  }
}
