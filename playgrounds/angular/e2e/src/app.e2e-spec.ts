import { browser, logging } from 'protractor'
import { AppPage } from './app.po'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('First game should be counter strike', async () => {
    await page.navigateTo()
    expect(await page.getFirstGame()).toEqual('Counter-Strike')
  })

  it('First facet value of first facet should be Action', async () => {
    await page.navigateTo()
    expect(await page.getFirstFacetValueOfFirstFacet()).toEqual('Action')
  })

  it('Clear refinement should exist', async () => {
    await page.navigateTo()
    expect(await page.getClearRefinementText()).toEqual('Clear refinements')
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER)
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    )
  })
})
