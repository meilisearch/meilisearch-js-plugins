import { browser, by, element } from 'protractor'

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return await browser.get(browser.baseUrl)
  }

  async getFirstGame(): Promise<string> {
    return await element(by.css('.ais-Hits-item > .hit-name')).getText()
  }

  async getFirstFacetValueOfFirstFacet(): Promise<string> {
    return await element(by.css('.ais-RefinementList-labelText')).getText()
  }

  async getClearRefinementText(): Promise<string> {
    return await element(by.css('.ais-ClearRefinements-button')).getText()
  }
}
