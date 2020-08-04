import instantMeiliSearch from '../src/index'

test('Should test if instantMeiliSearch Client is created correctly', () => {
  const client = instantMeiliSearch('http://localhost:7700', 'masterKey')
  expect(client.hitsPerPage).toBe(10)
  expect(client.limitPerRequest).toBe(50)
  expect(client.attributesToHighlight[0]).toBe('*')
})
