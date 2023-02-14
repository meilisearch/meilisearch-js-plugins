const { MeiliSearch } = require('meilisearch')
const movies = require('./assets/movies.json')
const games = require('./assets/games.json')

;(async () => {
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

  const moviesRes = await moviesIndex.addDocuments(movies)
  const gamesRes = await gamesIndex.addDocuments(games)

  const moviesTask = await client.waitForTask(moviesRes.taskUid)
  const gamesTask = await client.waitForTask(gamesRes.taskUid)
  console.log(moviesTask)
  console.log(gamesTask)
})()
