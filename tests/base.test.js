import instantMeiliSearch from '../src/index'

test('Should test if instantMeiliSearch Client is created correctly', () => {
  const client = instantMeiliSearch('http://localhost:7700', 'masterKey')
  expect(client.paginationTotalHits).toBe(200)
  expect(client.attributesToHighlight[0]).toBe('*')
  expect(client.placeholderSearch).toBe(true)
})
