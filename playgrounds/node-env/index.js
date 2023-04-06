const { instantMeiliSearch } = require('@meilisearch/instant-meilisearch')
const { MeiliSearch } = require('meilisearch')


const client = instantMeiliSearch('http://localhost:7700', 'masterKey', {})
const msClient = new MeiliSearch({ host: 'http://localhost:7700', apiKey: 'masterKey'})

;(async() => {
  try {
    const task1 = await msClient.index('node_test').addDocuments([])
    await msClient.waitForTask(task1.taskUid)
    await client.search([
      {
        indexName: 'node_test',
        params: {
          query: '',
        },
      }
    ])

    const task2 = await msClient.index('node_test').delete()
    await msClient.waitForTask(task2.taskUid)
    process.exit(0)
  } catch(e) {
    console.error('Could not run the `umd` build in a node environment')
    process.exit(1)
  }
})()
