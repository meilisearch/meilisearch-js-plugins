import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { SearchClient } from '../types/SearchClient'
import { ClientConfig } from '../types/ClientConfig'

import { createUserAgent } from './createUserAgent'

export function createSearchClient() {
  return ({ url, apiKey, options = {} }: ClientConfig): SearchClient => {
    const searchClient = instantMeiliSearch(url, apiKey, {
      ...options,
      clientAgents: createUserAgent(options.clientAgents),
    })

    return {
      ...searchClient,
    }
  }
}
