import { test, expect } from '@playwright/test';
import { HomePage } from '../src/page-objects/HomePage';

// test('Drafthouse homepage loads and shows navigation', async ({ page }) => {
//   const home = new HomePage(page as any);
//   await home.goto('https://drafthouse.com');
//   await home.acceptCookies();
//   await page.waitForTimeout(10000); //wait for reload after accepting cookies
//   const hasLink = await home.hasAboutLink();
//   expect(hasLink).toBeTruthy();
// });

// test('Able to sign in with valid credentials', async ({ page }) => {
//   const home = new HomePage(page as any);
//   await home.goto('https://drafthouse.com');
//   await home.acceptCookies();
//   await page.waitForTimeout(10000); //wait for reload after accepting cookies
//   await home.SignInWithTestUser();
//   // pass the expected data-subnav-name value for the signed-in user
//   const hasLink = await home.userNameIsVisible('Arunkanthan');
//   expect(hasLink).toBeTruthy();

// });

test('Able to navigate to market page from home page', async ({ page }) => {
  const home = new HomePage(page as any);
  await home.goto('https://drafthouse.com');
  await home.acceptCookies();
  await page.waitForTimeout(10000); //wait for reload after accepting cookies
  await home.navigateToMarket('Austin');
  await expect(page).toHaveURL(/.*austin.*/);
});



