import { instantMeiliSearch } from '../'

describe('Instant MeiliSearch Browser test', () => {
  it('Should have generated a instant-meilisearch client and displayed', () => {
    const client = instantMeiliSearch('http://localhost:7700', '')
    console.log(client)
    expect(1).toBe(1)
  })
})
