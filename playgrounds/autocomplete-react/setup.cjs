const { MeiliSearch } = require('meilisearch')
const products = require('./bestbuy.json')

;(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  const task = await client.index('products').addDocuments(products)
  await client.waitForTask(task.taskUid)
})()
