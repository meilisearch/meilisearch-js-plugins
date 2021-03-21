const { UMDclient, CJSclient } = require('./index')
const instantsearch = require('instantsearch.js')

test('UMD client should correctly created', () => {
  expect(UMDclient.placeholderSearch).toBe(true)
  expect(UMDclient.hitsPerPage).toBe(20)
  expect(UMDclient.client.config.apiKey).toBe('masterKey')
})

test('CJS client should correctly created', () => {
  expect(CJSclient.placeholderSearch).toBe(true)
  expect(CJSclient.hitsPerPage).toBe(20)
  expect(CJSclient.client.config.apiKey).toBe('masterKey')
})

test('CJS instantsearch client should correctly created', () => {
  const CJSInstantSearch = instantsearch.default({
    indexName: 'cjs_index',
    searchClient: CJSclient,
  })
  // console.log(CJSInstantSearch.client.search())
  expect(CJSInstantSearch.indexName).toBe('cjs_index')
  expect(CJSInstantSearch.client.client.config.apiKey).toBe('masterKey')
  expect(CJSInstantSearch.client.placeholderSearch).toBe(true)
  expect(CJSInstantSearch.client.hitsPerPage).toBe(20)
})

test('UMD instantsearch client should correctly created', () => {
  const UMDInstantSearch = instantsearch.default({
    indexName: 'umd_index',
    searchClient: UMDclient,
  })
  // console.log(UMDInstantSearch.client.search())
  expect(UMDInstantSearch.indexName).toBe('umd_index')
  expect(UMDInstantSearch.client.client.config.apiKey).toBe('masterKey')
  expect(UMDInstantSearch.client.placeholderSearch).toBe(true)
  expect(UMDInstantSearch.client.hitsPerPage).toBe(20)
})
