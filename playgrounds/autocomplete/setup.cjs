const { MeiliSearch } = require('meilisearch')
const games = require('./assets/games.json')

;(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  await client.index('steam-video-games').delete()
  const task = await client.index('steam-video-games').addDocuments(games)
  await client.waitForTask(task.taskUid)
})()
