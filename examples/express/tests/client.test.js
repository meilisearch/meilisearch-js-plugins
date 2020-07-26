describe('Google', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('should be titled "Google"', async () => {
    await expect(page).toMatch(
      '{"client":{"cancelTokenSource":{"token":{"promise":{}}},"config":{"host":"http://localhost:7700","apiKey":"masterKey"}},"hitsPerPage":10,"limitPerRequest":20,"attributesToHighlight":"*"}'
    )
  })
})
