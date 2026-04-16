import {
  instantMeiliSearch,
  meilisearch,
} from '@meilisearch/instant-meilisearch'

const { searchClient } = instantMeiliSearch(
  'http://localhost:7700',
  'masterKey',
  {}
)
const msClient = new meilisearch.MeiliSearch({
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
} catch (e) {
  console.error(e)
  process.exitCode = 1
}
