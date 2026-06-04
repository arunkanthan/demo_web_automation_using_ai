import type { Page } from 'playwright';
import { BasePage } from './BasePage';

const acceptSelector = 'button#onetrust-accept-btn-handler';
const signInSelector = 'ion-button[id="sign-in-sign-up-trigger-modal"]';
const emailFieldSelector = '#ion-input-2';
const passwordFieldSelector = '#ion-input-3';
const submitButtonSelector = 'ion-button[type="submit"]';

export class HomePage extends BasePage {
  constructor(page: Page) {
    
    super(page);
  }

  async acceptCookies(timeout = 10000) {
    const accept = this.page.locator(acceptSelector);
    await accept.click({ force: true });
     
  }

  async hasFindATheaterLink() {
    const el = await this.page.$('text=/Find a Theater/i');
    return !!el;
  }

  async SignIn(
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

  
}
