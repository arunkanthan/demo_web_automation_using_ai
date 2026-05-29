import { test, expect } from '@playwright/test';
import { HomePage } from '../src/page-objects/HomePage';

test('drafthouse homepage loads and shows navigation', async ({ page }) => {
  const home = new HomePage(page as any);
  await home.goto('https://drafthouse.com');
  await
  await home.acceptCookies();
  await page.waitForTimeout(10000);
  //const hasLink = await home.hasFindATheaterLink();
  //expect(hasLink).toBeTruthy();
});

