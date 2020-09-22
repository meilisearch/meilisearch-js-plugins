describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('Should have generated a instant-meiisearch client and displayed', async () => {
    await expect(page).toMatch(
      'http://localhost:7700'
    )
  })
})
