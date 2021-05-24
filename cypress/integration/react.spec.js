describe('Strapi Login flow', () => {
  before(() => {
    cy.clearCookies()
    cy.visit('http://localhost:1234')
  })

  it('Should visit the dashboard', () => {
    cy.url().should('match', /http:\/\/localhost:1234/)
  })

  it('Contains stats', () => {
    cy.contains('12,546 results')
  })

  it('Contains filter clear', () => {
    cy.contains('Clear all filters')
  })

  it('Contains Genres', () => {
    cy.contains('Genres')
    cy.contains('Action')
    cy.contains('5,554')
  })

  it('Contains searchBar', () => {
    cy.get('input[type="search"]').should('have.value', '')
  })

  it('Contains Hits', () => {
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Counter-Strike')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Play the worlds number 1 ')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('9.99 $')
  })

  it('click on facets', () => {
    const checkbox = `.ais-RefinementList-list .ais-RefinementList-checkbox`
    cy.get(`${checkbox}`).eq(1).click()
    cy.contains('1,939')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Portal 2')
    cy.get('.ais-InfiniteHits-item')
      .eq(0)
      .contains('Portal 2 draws from the award-winning')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('19.99 $')
  })

  it('Search', () => {
    cy.get('input[type="search"]').type('orwell')
    cy.wait(1000)
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Orwell')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Big Brother has arrived')
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Late 2016')
  })

  it('Unclick on facets', () => {
    const checkbox = `.ais-RefinementList-list .ais-RefinementList-checkbox`
    cy.get(`${checkbox}`).eq(0).click()
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Orwell')
  })

  it('Placeholder Search', () => {
    cy.get('input[type="search"]').clear()
    cy.wait(1000)
    cy.get('.ais-InfiniteHits-item').eq(0).contains('Counter-Strike')
  })

  it('Paginate Search', () => {
    cy.get('.ais-InfiniteHits-loadMore').click()
    cy.get('.ais-InfiniteHits-item').should('have.length', 12)
  })
})
