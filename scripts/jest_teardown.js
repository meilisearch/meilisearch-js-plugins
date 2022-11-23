const { MeiliSearch } = require('meilisearch')

const HOST = 'http://localhost:7700'
const API_KEY = 'masterKey'

afterAll(async () => {
  const client = new MeiliSearch({ host: HOST, apiKey: API_KEY })
  await client.deleteIndex('movies')
  const task = await client.deleteIndex('games')

  await client.waitForTask(task.taskUid)
})
