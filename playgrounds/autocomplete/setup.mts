import { meilisearch } from '@meilisearch/instant-meilisearch'
import games from './assets/games.json' with { type: 'json' }

const client = new meilisearch.MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
})
await client.index('steam-video-games').delete().waitTask()
await client.index('steam-video-games').addDocuments(games).waitTask()
