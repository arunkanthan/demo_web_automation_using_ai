import type { Page } from 'playwright';
import { BasePage } from './BasePage';

// const heroTitleSelector = '.adc-hero__title';
// const heroBuyTicketsButtonSelector = '.adc-hero__buy-tickets-btn';
// const heroSectionSelector = '.adc-show-page__hero';
// const stickyBarSelector = '.adc-hero__sticky-scroll';
// const metaInlineSelector =
//   '.adc-film-description-mobile__meta-inline, .adc-film-description-details__meta-inline';
// const descriptionHeadingSelector = '.adc-film-description-details__headline';
// const descriptionBodySelector = '.adc-film-description-details__description';
// const trailerSectionSelector = '.adc-trailer-section';
// const trailerThumbnailSelector = '.adc-video-wrapper__thumbnail';
// const trailerIframeSelector = '.adc-video-wrapper iframe';

const signInSelector = 'ion-button[id="sign-in-sign-up-trigger-modal"]';
const emailFieldSelector = '#ion-input-2';
const passwordFieldSelector = '#ion-input-3';
const submitButtonSelector = 'ion-button[type="submit"]:has-text("SIGN IN"):visible';
const errorModalSelector =  "//ion-modal[@aria-label='ERROR']";

export class Login extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoShow(slug: string, market = 'austin') {
    await this.goto(`https://drafthouse.com/${market}/show/${slug}`);
    await this.title();
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

    const submitButton = this.page.locator(submitButtonSelector);
    await submitButton.waitFor({ state: 'visible', timeout });
    await submitButton.click();
  }

    async isErrorModalDisplayed(timeout = 10000) {
    const modal = this.page.locator(errorModalSelector);
    return await modal.isVisible({ timeout }).catch(() => false);
  }
}