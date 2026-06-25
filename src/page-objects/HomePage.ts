import type { Page } from 'playwright';
import { BasePage } from './BasePage';

const acceptSelector = 'button#onetrust-accept-btn-handler';
const signInSelector = 'ion-button[id="sign-in-sign-up-trigger-modal"]';
const emailFieldSelector = '#ion-input-2';
const passwordFieldSelector = '#ion-input-3';
const submitButtonSelector = 'ion-button[type="submit"]';
const userNameSelector = "//ion-button[@data-subnav-name='{}']";
const profileMenuSelector = 'ion-icon';
const marketDropdownSelector  = '//ion-button[@data-subnav-name="CHOOSE_YOUR_ALAMO"]';
const marketOptionSelector = '//*[contains(text(), "{}")]';
const calendarToggleWrapperSelector = '.adc-listing_movies__calendar-toggle-wrapper';
const calendarToggleSelector = '.toggle-inner';

export class HomePage extends BasePage {
  constructor(page: Page) {
    
    super(page);
  }

  async acceptCookies(timeout = 10000) {
    const accept = this.page.locator(acceptSelector);
    await accept.click({ force: true });
     
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

  async SignInWithTestUser(
    email = process.env.DRAFTHOUSE_EMAIL ?? 'test@example.com',
    password = process.env.DRAFTHOUSE_PASSWORD ?? 'password',
    timeout = 10000
  ) {
    const signIn = this.page.locator(signInSelector);
    await signIn.waitFor({ state: 'visible', timeout });
    await signIn.click();

    const emailField = this.page.locator(emailFieldSelector);
    await emailField.waitFor({ state: 'visible', timeout });
    await emailField.fill(email);

    const passwordField = this.page.locator(passwordFieldSelector);
    await passwordField.waitFor({ state: 'visible', timeout });
    await passwordField.fill(password);

    const submitButton = this.page.locator('ion-button[type="submit"]:has-text("SIGN IN"):visible');
    await submitButton.waitFor({ state: 'visible', timeout });
    await submitButton.click();
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
