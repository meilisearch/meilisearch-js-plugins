import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { AutocompleteSearchClient } from '../types/AutocompleteSearchClient'
import { AutocompleteOptions } from '../types/AutoCompleteOptions'
import { createUserAgent } from './createUserAgent'

type InstantMeilisearch = typeof instantMeiliSearch
type MeiliURL = Parameters<InstantMeilisearch>[0]
type MeiliApiKey = Parameters<InstantMeilisearch>[1]

export function createSearchClient() {
  return (
    url: MeiliURL,
    apiKey: MeiliApiKey,
    autocompleteOptions: AutocompleteOptions = {}
  ): AutocompleteSearchClient => {
    const searchClient = instantMeiliSearch(url, apiKey, {
      ...autocompleteOptions,
      clientAgents: createUserAgent(autocompleteOptions.clientAgents),
    })

    return {
      ...searchClient,
    }
  }
}
