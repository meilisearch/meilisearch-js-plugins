const { MeiliSearch } = require('meilisearch')
const products = require('./assets/games.json')

;(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  await client.index('products').delete()
  const task = await client.index('products').addDocuments(products)
  await client.waitForTask(task.taskUid)
})()
