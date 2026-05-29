import type { Page } from 'playwright';
import { BasePage } from './BasePage';

const acceptSelector = 'button#onetrust-accept-btn-handler';

export class HomePage extends BasePage {
  constructor(page: Page) {
    
    super(page);
  }

  async acceptCookies(timeout = 10000) {

      let accept = this.page.locator(acceptSelector);
        await accept.click();

    }
    
    
  async hasFindATheaterLink() {
    const el = await this.page.$('text=/Find a Theater/i');
    return !!el;
  }
}
