import { test, expect } from '@playwright/test';
import { Login } from '../src/page-objects/Login';
import { HomePage } from '../src/page-objects/HomePage';


//Login Page Test Cases


test('TC1 - Error is displayed for invalid login credentials', async ({ page }) => {
  const login = new Login(page as any);
  const homePage  = new HomePage(page as any);
  homePage.goto('https://drafthouse.com');
  await homePage.acceptCookies();
  await page.waitForTimeout(10000); //wait for reload after accepting cookies
  await login.SignInWithTestUser('invalid@example.com', 'invalidpassword');
  await page.waitForTimeout(5000); //wait for reload after accepting cookies
  expect(await login.isErrorModalDisplayed()).toBeTruthy();
});

