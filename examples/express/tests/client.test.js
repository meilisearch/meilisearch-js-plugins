describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('Should have generated a instant-meiisearch client and displayed', async () => {
    await expect(page).toMatch(
      '{"client":{"config":{"host":"http://localhost:7700","apiKey":"masterKey"},"httpRequest":{"headers":{"Content-Type":"application/json","X-Meili-API-Key":"masterKey"},"baseUrl":"http://localhost:7700","url":"http://localhost:7700/"}},"attributesToHighlight":["*"],"paginationTotalHits":200,"placeholderSearch":true}'
    )
  })
})
