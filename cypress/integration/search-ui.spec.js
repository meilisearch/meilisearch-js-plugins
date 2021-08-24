const {
  playground,
  [playground]: { host },
} = Cypress.env()

const HIT_ITEM_CLASS =
  playground === 'react' ? '.ais-InfiniteHits-item' : '.ais-Hits-item'

describe(`${playground} playground test`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(host)
  })

  it('Should visit the dashboard', () => {
    cy.url().should('match', /http:\/\/localhost:/)
  })

  it('Contains stats', () => {
    if (playground === 'react') cy.contains('12,546 results')
    if (playground === 'angular') cy.contains('12546 results')
  })

  it('Contains filter clear', () => {
    if (playground === 'react') cy.contains('Clear all filters')
    if (playground === 'angular') cy.contains('Clear refinements')
  })

  it('Contains Genres', () => {
    cy.contains('Genres')
    cy.contains('Action')
    if (playground === 'react') cy.contains('5,554')
    if (playground === 'angular') cy.contains('5554')
  })

  it('Contains searchBar', () => {
    cy.get('.ais-SearchBox-input').should('have.value', '')
  })

  it('Contains Hits', () => {
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Counter-Strike')
    cy.get(HIT_ITEM_CLASS).eq(0).contains('9.99 $')
  })

  it('click on facets', () => {
    const checkbox = `.ais-RefinementList-list .ais-RefinementList-checkbox`
    cy.get(checkbox).eq(1).click()
    if (playground === 'react') cy.contains('1,939')
    if (playground === 'angular') cy.contains('1939')
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Kings Quest Collection')
    cy.get(HIT_ITEM_CLASS).eq(0).contains('19.99 $')
  })

  it('Search', () => {
    cy.get('.ais-SearchBox-input').type('orwell')
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Orwell')
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Late 2016')
  })

  it('Unclick on facets', () => {
    const checkbox = `.ais-RefinementList-list .ais-RefinementList-checkbox`
    cy.get(checkbox).eq(0).click()
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Orwell')
  })

  it('Placeholder Search', () => {
    cy.get('.ais-SearchBox-input').clear()
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Counter-Strike')
  })

  it('Paginate Search', () => {
    if (playground === 'react') {
      cy.get('.ais-InfiniteHits-loadMore').click()
      cy.get(HIT_ITEM_CLASS).should('have.length', 12)
    } else {
      if (playground === 'vue') cy.get('.ais-Pagination-item').eq(3).click()
      else cy.get('.ais-Pagination-item--page').eq(1).click()
      cy.wait(500)
      cy.get(HIT_ITEM_CLASS).eq(0).contains('Kings Quest Collection')
    }
  })
})
