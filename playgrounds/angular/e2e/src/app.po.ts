import { browser, by, element, ExpectedConditions } from 'protractor'

const timeOutError = 'Element taking too long to appear in the DOM'

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return await browser.get(browser.baseUrl)
  }

  async getFirstGame(): Promise<string> {
    const elem = element(by.css('.ais-Hits-item > .hit-name'))
    await browser.wait(ExpectedConditions.presenceOf(elem), 5000, timeOutError)
    return await elem.getText()
  }

  async getFirstFacetValueOfFirstFacet(): Promise<string> {
    const elem = element(by.css('.ais-RefinementList-labelText'))
    await browser.wait(ExpectedConditions.presenceOf(elem), 5000, timeOutError)
    return await elem.getText()
  }

  async getClearRefinementText(): Promise<string> {
    const elem = element(by.css('.ais-ClearRefinements-button'))
    await browser.wait(ExpectedConditions.presenceOf(elem), 5000, timeOutError)
    return await elem.getText()
  }
}
