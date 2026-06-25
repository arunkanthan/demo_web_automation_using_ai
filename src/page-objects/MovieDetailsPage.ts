import type { Page } from 'playwright';
import { BasePage } from './BasePage';

const heroTitleSelector = '.adc-hero__title';
const heroBuyTicketsButtonSelector = '.adc-hero__buy-tickets-btn';
const heroSectionSelector = '.adc-show-page__hero';
const stickyBarSelector = '.adc-hero__sticky-scroll';
const metaInlineSelector =
  '.adc-film-description-mobile__meta-inline, .adc-film-description-details__meta-inline';
const descriptionHeadingSelector = '.adc-film-description-details__headline';
const descriptionBodySelector = '.adc-film-description-details__description';
const trailerSectionSelector = '.adc-trailer-section';
const trailerThumbnailSelector = '.adc-video-wrapper__thumbnail';
const trailerIframeSelector = '.adc-video-wrapper iframe';

export class MovieDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoShow(slug: string, market = 'austin') {
    await this.goto(`https://drafthouse.com/${market}/show/${slug}`);
    await this.title();
  }

  async titleIsVisible(expectedTitle: string) {
    const title = this.page.locator(heroTitleSelector);
    await title.waitFor({ state: 'visible', timeout: 10000 });
    return (await title.textContent())?.trim() === expectedTitle;
  }

  async getVisibleMetaText(timeout = 10000) {
    const meta = this.page.locator(metaInlineSelector).filter({ visible: true });
    await meta.first().waitFor({ state: 'visible', timeout });
    return meta.first().textContent();
  }

  async descriptionIsVisible() {
    const heading = this.page.locator(descriptionHeadingSelector);
    const body = this.page.locator(descriptionBodySelector);
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    return (await heading.isVisible()) && (await body.isVisible());
  }

  async trailerSectionIsVisible() {
    return this.page.locator(trailerSectionSelector).isVisible();
  }

  async playTrailer(timeout = 10000) {
    const thumbnail = this.page.locator(trailerThumbnailSelector);
    await thumbnail.waitFor({ state: 'visible', timeout });
    await thumbnail.click();
  }

  async getTrailerIframeSrc(timeout = 10000) {
    const iframe = this.page.locator(trailerIframeSelector);
    await iframe.waitFor({ state: 'visible', timeout });
    return iframe.getAttribute('src');
  }

  async getTrailerIframeAttribute(name: string) {
    return this.page.locator(trailerIframeSelector).getAttribute(name);
  }

  async buyTicketsButtonIsVisibleInHero() {
    const button = this.page.locator(heroBuyTicketsButtonSelector);
    const hero = this.page.locator(heroSectionSelector);
    await button.waitFor({ state: 'visible', timeout: 10000 });
    return (await button.isVisible()) && (await hero.locator(heroBuyTicketsButtonSelector).count()) > 0;
  }

  async scrollDown(distance = 1500) {
    await this.page.mouse.wheel(0, distance);
    await this.page.waitForTimeout(300);
  }

  async stickyBuyTicketsButtonIsInViewport() {
    const stickyBar = this.page.locator(stickyBarSelector);
    const stickyBuyButton = stickyBar.locator(`${heroBuyTicketsButtonSelector}, ion-button`);
    await stickyBar.waitFor({ state: 'visible', timeout: 10000 });
    const box = await stickyBar.boundingBox();
    const inViewport = !!box && box.y >= 0 && box.y < (this.page.viewportSize()?.height ?? 0);
    return inViewport && (await stickyBuyButton.first().isVisible());
  }
}
