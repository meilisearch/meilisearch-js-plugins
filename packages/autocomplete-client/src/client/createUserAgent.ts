import { PACKAGE_VERSION } from '../package-version'

export const createUserAgent = (clientAgents: string[] = []): string[] => {
  const autocompleteAgents = `Meilisearch autocomplete-client (v${PACKAGE_VERSION})`

  return clientAgents.concat(autocompleteAgents)
}
