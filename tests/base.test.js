import instantMeiliSearch from '../src/index'

test('Should test if instantMeiliSearch Client is created correctly', () => {
  console.log(instantMeiliSearch)

  const client = instantMeiliSearch('http://localhost:7700', 'masterKey')
  expect(client.attributesToHighlight).toBe('*')
})
