# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Playwright + TypeScript end-to-end test scaffold using the Page Object Model. Tests run against the **live** Alamo Drafthouse site (https://drafthouse.com) — there is no local app or mock server. Because the target is a real production site built with Ionic, selectors and timing are inherently fragile; assertions depend on real content (specific movie slugs, ratings, runtimes) that can change upstream.

## Commands

```bash
npm install && npx playwright install   # first-time setup (browsers)
npm test                                # run all tests headless (chromium only)
npm run test:headed                     # run with a visible browser
npx playwright test tests/movie_details.spec.ts          # single file
npx playwright test tests/movie_details.spec.ts -g "TC1" # single test by title substring
npm run bs:android                      # BrowserStack mobile smoke (Android), via ts-node
npm run bs:ios                          # BrowserStack mobile smoke (iOS)
```

There is no linter or build step configured; `tsc` is only used transitively by `ts-node` for the BrowserStack script.

## Environment

`playwright.config.ts` calls `dotenv` so a root `.env` is loaded automatically for the test runner. Required keys (see `.env` for the template): `DRAFTHOUSE_EMAIL`, `DRAFTHOUSE_PASSWORD` (consumed by `HomePage.SignInWithTestUser`), and `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY` (consumed by `scripts/bs-run.ts`). `.env` is gitignored — never commit credentials.

## Architecture

Two layers, kept strictly separated:

- **`src/page-objects/`** — all DOM interaction lives here. `BasePage` holds shared helpers (`goto`, cookie-banner handling, `scrollDown`); `HomePage` and `MovieDetailsPage` extend it and expose intent-level methods (e.g. `navigateToMarket`, `titleIsVisible`) that return booleans/strings rather than raw locators.
- **`tests/`** — spec files import a page object, drive it, and assert. Specs should contain **no raw selectors**; if a test needs a new interaction, add a method to the relevant page object instead.

The two entry points (Playwright runner and the BrowserStack script) both construct page objects the same way, so page objects are the single source of truth for site interaction.

### Conventions that aren't obvious

- **`page as any` cast is required.** Page objects type their `page` as `Page` from the `playwright` package, but the test runner injects the `@playwright/test` fixture (a different type). Every spec passes `new HomePage(page as any)`. Keep this pattern; don't try to "fix" the types by changing the import.
- **Selectors are module-level `const`s** at the top of each page object, not inline. Add new selectors there.
- **XPath templating.** Dynamic XPath selectors use a literal `{}` placeholder filled with `selector.replace('{}', value)` (e.g. `userNameSelector`, `marketOptionSelector`). Follow this convention rather than string interpolation.
- **Ionic components.** The site renders web components — expect `ion-button`, `ion-input`, `ion-icon`. Input IDs like `#ion-input-2` are positional and brittle.
- **Cookie banner is OneTrust** (`button#onetrust-accept-btn-handler`). Accepting it triggers a full page reload, which is why specs follow `acceptCookies()` with a long `waitForTimeout(10000)`. `BasePage.acceptCookiesIfPresent` is the safe no-op-if-absent variant used by movie-details tests.
- **Hard waits.** Specs lean on `page.waitForTimeout(...)` after cookie acceptance and market navigation. These are deliberate workarounds for the reload, not oversights — preserve them unless replacing with a proper wait condition.

### Test data

`tests/movie_details.spec.ts` cases are sourced from "AI Testing.xlsx" and pin specific movie slugs (`spider-man-brand-new-day`, `maddies-secret`) with exact expected metadata (rating, runtime, year). These assertions break when the upstream site updates those titles; update the slug/expectation constants at the top of the file together.

### Playwright config

Single `chromium` project is active; `firefox` and `webkit` are commented out in `playwright.config.ts`. `retries: 0`, 30s test timeout, 5s action/expect timeout, headless by default. The BrowserStack script (`scripts/bs-run.ts`) bypasses this config entirely — it connects over the BrowserStack CDP/Playwright websocket endpoint and builds device capabilities itself.
