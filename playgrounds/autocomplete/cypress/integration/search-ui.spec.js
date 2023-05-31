const {
  playground,
  [playground]: { host },
} = Cypress.env()

const HIT_TITLE = '.aa-ItemContentTitle'
const HIT_DESCRIPTION = '.aa-ItemContentDescription'

describe(`${playground} playground test`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(host)
  })

  it('Should visit the dashboard', () => {
    cy.url().should('match', /http:\/\/localhost:/)
  })

  it('Contains searchBar', () => {
    cy.get('#autocomplete-0-input').should('have.value', '')
  })

  it('Search', () => {
    cy.get('#autocomplete-0-input').type('Counter-Strike')
    cy.wait(1000)
    cy.get(HIT_TITLE).eq(0).contains('Counter-Strike')
  })

  it('Should ensure the snippet and highlight component are rendered correctly', () => {
    cy.get('#autocomplete-0-input').type('Counter-Strike')
    cy.wait(1000)
    cy.get(HIT_TITLE).eq(0).children('test').eq(0).contains('Counter')
    cy.get(HIT_DESCRIPTION)
      .eq(1)
      .contains('..content for Counter-Strikes award..')
    cy.get(HIT_DESCRIPTION).eq(1).children('mark').eq(0).contains('Counter')
    cy.get(HIT_DESCRIPTION).eq(1).children('mark').eq(1).contains('Strike')
  })
})
