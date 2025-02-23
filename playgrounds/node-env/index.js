import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { MeiliSearch } from 'meilisearch'

const { searchClient } = instantMeiliSearch(
  'http://localhost:7700',
  'masterKey',
  {}
)
const msClient = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
})

try {
  const task1 = await msClient.index('node_test').addDocuments([])
  await msClient.waitForTask(task1.taskUid)
  await searchClient.search([
    {
      indexName: 'node_test',
      params: {
        query: '',
      },
    },
  ])

  const task2 = await msClient.index('node_test').delete()
  await msClient.waitForTask(task2.taskUid)
  process.exit(0)
} catch (e) {
  console.log(e)
  console.error('Could not run the `umd` build in a node environment')
  process.exit(1)
}
