import { MeiliSearch } from 'meilisearch'
import { InstantMeiliSearchOptions, InstantMeiliSearchInstance } from '../types'

import {
  transformToMeiliSearchParams,
  transformToISResponse,
} from '../transformers'

export function instantMeiliSearch(
  hostUrl: string,
  apiKey: string,
  options: InstantMeiliSearchOptions = {}
): InstantMeiliSearchInstance {
  return {
    MeiliSearchClient: new MeiliSearch({ host: hostUrl, apiKey: apiKey }),
    search: async function ([isSearchRequest]) {
      try {
        // Params got from InstantSearch
        console.log({
          // options,
          isSearchRequest,
        })
        const {
          params: instantSearchParams,
          indexName: indexUid,
        } = isSearchRequest

        const { paginationTotalHits, primaryKey, placeholderSearch } = options
        const { page, hitsPerPage } = instantSearchParams
        const client = this.MeiliSearchClient
        const context = {
          client,
          paginationTotalHits: paginationTotalHits || 200,
          primaryKey: primaryKey || undefined,
          placeholderSearch: placeholderSearch !== false, // true by default
          hitsPerPage: hitsPerPage === undefined ? 20 : hitsPerPage, // 20 is the MeiliSearch's default limit value. `hitsPerPage` can be changed with `InsantSearch.configure`.
          page: page || 0, // default page is 0 if none is provided
        }

        // Transform IS params to MeiliSearch params
        const msSearchParams = transformToMeiliSearchParams(
          instantSearchParams,
          context
        )

        // Executes the search with MeiliSearch
        const searchResponse = await client
          .index(indexUid)
          .search(msSearchParams.q, msSearchParams)

        console.log({ searchResponse })
        // Parses the MeiliSearch response and returns it for InstantSearch
        return transformToISResponse(
          indexUid,
          searchResponse,
          instantSearchParams,
          context
        )
      } catch (e) {
        console.error(e)
        throw new Error(e)
      }
    },
  }
}
