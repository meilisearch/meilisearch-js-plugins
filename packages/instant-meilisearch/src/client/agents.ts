import { PACKAGE_VERSION } from '../package-version.js'

export const constructClientAgents = (
  clientAgents: string[] = []
): string[] => {
  const instantMeilisearchAgent = `Meilisearch instant-meilisearch (v${PACKAGE_VERSION})`

  return clientAgents.concat(instantMeilisearchAgent)
}
