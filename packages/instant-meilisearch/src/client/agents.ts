import pkg from '../../package.json' with { type: 'json' }

export const constructClientAgents = (
  clientAgents: string[] = []
): string[] => {
  const instantMeilisearchAgent = `Meilisearch instant-meilisearch (v${pkg.version})`

  return clientAgents.concat(instantMeilisearchAgent)
}
