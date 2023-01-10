const {
  instantMeiliSearch: UMDinstantMeiliSearch,
} = require('../dist/instant-meilisearch.umd')
const {
  instantMeiliSearch: CJSinstantMeiliSearch,
} = require('../dist/instant-meilisearch.cjs')

const UMDclient = UMDinstantMeiliSearch('http://localhost:7700', 'masterKey')
const CJSclient = CJSinstantMeiliSearch('http://localhost:7700', 'masterKey')
const instantsearch = require('instantsearch.js')

test('UMD client should correctly created', () => {
  expect(UMDclient.search).not.toBeUndefined()
})

test('CJS client should correctly created', () => {
  expect(CJSclient.search).not.toBeUndefined()
})

test('CJS instantsearch client should correctly created', () => {
  const CJSInstantSearch = instantsearch.default({
    indexName: 'cjs_index',
    searchClient: CJSclient,
  })
  expect(CJSInstantSearch.indexName).toBe('cjs_index')
  expect(CJSInstantSearch.client.search).not.toBeUndefined()
})

test('UMD instantsearch client should correctly created', () => {
  const UMDInstantSearch = instantsearch.default({
    indexName: 'umd_index',
    searchClient: UMDclient,
  })
  expect(UMDInstantSearch.indexName).toBe('umd_index')
  expect(UMDInstantSearch.client.search).not.toBeUndefined()
})
