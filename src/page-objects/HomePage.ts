import type { Page } from 'playwright';
import { BasePage } from './BasePage';


const userNameSelector = "//ion-button[@data-subnav-name='{}']";
const profileMenuSelector = 'ion-icon';
const marketDropdownSelector  = '//ion-button[@data-subnav-name="CHOOSE_YOUR_ALAMO"]';
const marketOptionSelector = '//*[contains(text(), "{}")]';
const calendarToggleSelector = '.toggle-inner';

export class HomePage extends BasePage {
  constructor(page: Page) {
    
    super(page);
  }

  async acceptCookies(timeout = 10000) {
    await this.acceptCookiesIfPresent(timeout);
  }

  async hasAboutLink() {
    const el = await this.page.$('text=/About/i');
    return !!el;
  }

   async hasProfileLink() {
    const el = await this.page.locator(profileMenuSelector);
    return !!el;
  }

  async userNameIsVisible(userName: string, timeout = 10000) {
    const selector = userNameSelector.replace('{}', userName);
    const profileMenu = this.page.locator(`xpath=${selector}`);
    await profileMenu.waitFor({ state: 'visible', timeout });
    return await profileMenu.isVisible();
  }

  async navigateToMarket(maketName: string, timeout = 10000) {   
    const marketDropdown = this.page.locator(marketDropdownSelector);
    await marketDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await marketDropdown.click();
    const marketOption = this.page.locator(marketOptionSelector.replace('{}', maketName)).nth(1);
    await marketOption.waitFor({ state: 'visible', timeout: 10000 });
    await marketOption.click();
  }


  async toggleCalendar() {
    const calendarToggle = this.page.locator(calendarToggleSelector).nth(0);
    await calendarToggle.waitFor({ state: 'visible', timeout: 10000 });
    await calendarToggle.click();
  }

  async isCalendarToggleOn(timeout = 10000) {
    const calendarSwitch = this.page.getByRole('switch', { name: 'CALENDAR VIEW' });
    await calendarSwitch.waitFor({ state: 'visible', timeout });
    return (await calendarSwitch.getAttribute('aria-checked')) === 'true';
  }

}
