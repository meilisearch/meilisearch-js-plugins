import { browser, by, element } from 'protractor'

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl)
  }

  async getFirstGame(): Promise<string> {
    return element(by.css('.ais-Hits-item:first-child > .hit-name')).getText()
  }

  async getFirstFacetValueOfFirstFacet(): Promise<string> {
    return element(by.css('.ais-RefinementList-labelText')).getText()
  }

  async getClearRefinementText(): Promise<string> {
    return element(by.css('.ais-ClearRefinements-button')).getText()
  }
}
