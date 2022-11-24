const { MeiliSearch } = require('meilisearch')
const movies = require('../../assets/movies.json')
const games = require('../../assets/games.json')

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
    filterableAttributes: ['genres', 'color', 'platforms'],
  })

  await moviesIndex.addDocuments(movies)
  const response = await gamesIndex.addDocuments(games)

  const task = await client.waitForTask(response.taskUid)
  console.log(task)
})()
