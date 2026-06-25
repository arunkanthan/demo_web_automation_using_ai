import { test, expect } from '@playwright/test';
import { MovieDetailsPage } from '../src/page-objects/MovieDetailsPage';

// Test cases sourced from "AI Testing.xlsx" — Movie Details page (drafthouse.com).
// Movies used:
//  - spider-man-brand-new-day: unreleased title, no runtime shown by design (TC2 edge case)
//  - maddies-secret: released title, runtime present in meta line (TC2 main case)
const SPIDER_MAN = { slug: 'spider-man-brand-new-day', title: 'Spider-Man: Brand New Day' };
const MADDIES_SECRET = { slug: 'maddies-secret', title: "Maddie's Secret" };

test('TC1 - Movie Details page loads successfully for a selected movie', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  await expect(page).toHaveURL(new RegExp(`/show/${SPIDER_MAN.slug}$`));
  expect(await movie.titleIsVisible(SPIDER_MAN.title)).toBeTruthy();
  expect(await movie.descriptionIsVisible()).toBeTruthy();
  expect(await movie.trailerSectionIsVisible()).toBeTruthy();
  expect(await movie.buyTicketsButtonIsVisibleInHero()).toBeTruthy();
});

test('TC2 - title, rating, runtime, release year display correctly (with runtime)', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(MADDIES_SECRET.slug);
  await movie.acceptCookiesIfPresent();

  expect(await movie.titleIsVisible(MADDIES_SECRET.title)).toBeTruthy();
  const meta = await movie.getVisibleMetaText();
  expect(meta).toContain('Rated NR');
  expect(meta).toContain('100 min');
  expect(meta).toContain('2026');
});

test('TC2b - unreleased title shows rating and year but no runtime (by design)', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  const meta = await movie.getVisibleMetaText();
  expect(meta).toContain('Rated PG-13');
  expect(meta).toContain('2026');
  expect(meta).not.toContain('min');
});

test('TC3 - description section displays with heading and body text', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  expect(await movie.descriptionIsVisible()).toBeTruthy();
});

test('TC4 - trailer section loads a YouTube embedded player', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  expect(await movie.trailerSectionIsVisible()).toBeTruthy();
  await movie.playTrailer();

  const src = await movie.getTrailerIframeSrc();
  expect(src).toMatch(/youtube\.com/);
});

test('TC5 - embedded YouTube player exposes play/pause/volume/fullscreen controls', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();
  await movie.playTrailer();

  const src = await movie.getTrailerIframeSrc();
  expect(src).toMatch(/youtube\.com/);
  expect(await movie.getTrailerIframeAttribute('allowfullscreen')).not.toBeNull();
  const allow = await movie.getTrailerIframeAttribute('allow');
  expect(allow).toContain('autoplay');
  expect(allow).toContain('encrypted-media');
});

test('TC6 - Buy Tickets button displayed in the hero/banner section', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  expect(await movie.buyTicketsButtonIsVisibleInHero()).toBeTruthy();
});

test('TC7 - Buy Tickets button becomes sticky and remains visible on scroll', async ({ page }) => {
  const movie = new MovieDetailsPage(page as any);
  await movie.gotoShow(SPIDER_MAN.slug);
  await movie.acceptCookiesIfPresent();

  await movie.scrollDown();
  expect(await movie.stickyBuyTicketsButtonIsInViewport()).toBeTruthy();
});
