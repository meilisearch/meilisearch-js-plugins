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
  await msClient.index('node_test').addDocuments([]).waitTask()
  await searchClient.search([
    {
      indexName: 'node_test',
      params: {
        query: '',
      },
    },
  ])

  await msClient.index('node_test').delete().waitTask()
  process.exit(0)
} catch (e) {
  console.log(e)
  console.error('Could not run the `umd` build in a node environment')
  process.exit(1)
}
