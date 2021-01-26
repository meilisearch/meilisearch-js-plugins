async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('Should have generated a instant-meilisearch client and displayed', async () => {
    await expect(page.content()).resolves.toMatch(
      '{"client":{"config":{"host":"http://localhost:7700/","apiKey":"masterKey"},"httpRequest":{"headers":{"Content-Type":"application/json","X-Meili-API-Key":"masterKey"},"url":"http://localhost:7700/"}},"attributesToHighlight":["*"],"paginationTotalHits":200,"placeholderSearch":true}'
    )
  })
})
