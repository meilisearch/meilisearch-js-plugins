const {
  playground,
  [playground]: { host },
} = Cypress.env()

const HIT_ITEM_CLASS = '.ais-InfiniteHits-item'

describe(`${playground} playground test`, () => {
  before(() => {
    cy.clearCookies()
    cy.visit(host)
  })

  it('Should visit the dashboard', () => {
    cy.url().should('match', /http:\/\/localhost:/)
  })

  it('Contains stats', () => {
    cy.contains('15 results')
  })

  it('Contains filter clear', () => {
    cy.contains('Clear all filters')
  })

  it('Contains Genres', () => {
    cy.contains('Action')
  })

  it('Contains searchBar', () => {
    cy.get('.ais-SearchBox-input').should('have.value', '')
  })

  it('Contains Hits', () => {
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Counter-Strike')
    cy.get(HIT_ITEM_CLASS).eq(0).contains('9.99 $')
  })

  it('Sort by recommendationCound ascending', () => {
    const select = `.ais-SortBy-select`
    cy.get(select)
      .select('games:recommendationCount:asc')
      .should('have.value', 'games:recommendationCount:asc')
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Deathmatch Classic')
  })

  it('Sort by default relevancy', () => {
    const select = `.ais-SortBy-select`
    cy.get(select).select('games')
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Counter-Strike')
  })

  it('click on facets ensure disjunctive facet search', () => {
    const facet = `.ais-RefinementList-list`
    const checkbox = `.ais-RefinementList-checkbox`
    const facetCount = '.ais-RefinementList-count'
    cy.get(facet).eq(0).find(checkbox).eq(1).click() // genres > action
    cy.wait(1000)
    cy.get(facet).eq(0).find(facetCount).eq(0).contains('5') // genres > action count
    cy.get(facet).eq(1).find(facetCount).eq(0).contains('4') // players > multiplayer
  })

  it('Search', () => {
    cy.get('.right-panel')
      .find('.ais-SearchBox-input')
      .type('Half-Life')
      .should('have.value', 'Half-Life')
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Half-Life')
  })

  it('Unclick on facets', () => {
    const checkbox = `.ais-RefinementList-list .ais-RefinementList-checkbox`
    cy.get(checkbox).eq(0).click()
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Half-Life')
  })

  it('Placeholder Search', () => {
    cy.get('.ais-SearchBox-input').clear()
    cy.wait(1000)
    cy.get(HIT_ITEM_CLASS).eq(0).contains('Counter-Strike')
  })

  it('Paginate Search', () => {
    cy.get('.ais-InfiniteHits-loadMore').click()
    cy.get(HIT_ITEM_CLASS).should('have.length', 12)
  })
})
