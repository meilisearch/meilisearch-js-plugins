import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { SearchClient } from '../types/SearchClient'
import { ClientConfig } from '../types/ClientConfig'

export const concatUserAgents = (clientAgents: string[]): string[] => {
  return clientAgents.concat(clientAgents.filter((agent) => agent))
}

/**
 * Create a searchClient instance
 */
export function createSearchClient({ userAgent }: { userAgent: string }) {
  return ({
    url,
    apiKey,
    options = { clientAgents: [] },
  }: ClientConfig): SearchClient => {
    const clientAgents = options.clientAgents || []
    const searchClient = instantMeiliSearch(url, apiKey, {
      ...options,
      clientAgents: concatUserAgents([userAgent, ...clientAgents]),
    })

    return {
      ...searchClient,
    }
  }
}
