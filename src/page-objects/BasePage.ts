import type { Page } from 'playwright';

const acceptSelector = 'button#onetrust-accept-btn-handler';

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

  /**
   * Accepts the OneTrust cookie banner if it appears. Safe to call when the
   * banner isn't shown (e.g. already dismissed in this browser context).
   */
  async acceptCookiesIfPresent(timeout = 8000) {
    const accept = this.page.locator(acceptSelector);
    await accept.waitFor({ state: 'visible', timeout }).catch(() => {});
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
  }

    async scrollDown(distance = 1500) {
    await this.page.mouse.wheel(0, distance);
    await this.page.waitForTimeout(300);
  }
}
