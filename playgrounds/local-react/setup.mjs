import { MeiliSearch } from 'meilisearch'
import movies from './assets/movies.json' with { type: 'json' }
import games from './assets/games.json' with { type: 'json' }

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: 'masterKey',
})

const moviesIndex = client.index('movies')
const gamesIndex = client.index('games')

await moviesIndex.delete()
await gamesIndex.delete()

await moviesIndex.updateSettings({
  filterableAttributes: ['genres', 'color', 'platforms'],
})
await gamesIndex.updateSettings({
  filterableAttributes: ['genres', 'color', 'platforms', 'misc', 'players'],
  searchableAttributes: ['name', 'description'],
  sortableAttributes: ['recommendationCount'],
})

const moviesTask = await moviesIndex.addDocuments(movies)
const gamesTask = await gamesIndex.addDocuments(games)

await moviesTask.waitTask()
await gamesTask.waitTask()

console.log(moviesTask)
console.log(gamesTask)
