import type { Page } from 'playwright';

export class BasePage {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits for a cookie consent banner or accept button to become visible.
   * Returns the element handle if found, otherwise null.
   */
  async waitForCookieBanner(timeout = 10000) {
    const selector =
      'button#onetrust-accept-btn-handler, button:has-text("Accept all cookies"), button:has-text("Allow All"), button:has-text("Confirm My Choices"), div[id*=\"onetrust\"], div[class*=\"ot-\"], [data-testid=\"cookie-banner\"]';
    return this.page.waitForSelector(selector, { state: 'visible', timeout }).catch(() => null);
  }

  async title() {
    return this.page.title();
  }
}
