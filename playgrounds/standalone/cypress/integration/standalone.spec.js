const {
  playground,
  [playground]: { host },
} = Cypress.env()

describe(`${playground} playground test`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(host)
  })

  it('loads the standalone bundle and runs a search', () => {
    cy.get('[data-testid="status"]', { timeout: 20_000 }).should(
      'have.text',
      'ready'
    )
    cy.get('[data-testid="first-hit"]').invoke('text').should('not.be.empty')
  })
})
