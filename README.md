# Demo Web Automation — Playwright + TypeScript

This repo contains a small Playwright + TypeScript automation scaffold using the Page Object Model, with sample tests for https://drafthouse.com and a script to run a smoke flow on BrowserStack mobile devices (Android / iOS).

Quick start

1. Install dependencies

```bash
npm install
npx playwright install
```

2. Run local tests (Playwright Test runner)

```bash
npm test
```

3. Run BrowserStack mobile smoke run

Set env vars and run:

```bash
export BROWSERSTACK_USERNAME=your_user
export BROWSERSTACK_ACCESS_KEY=your_key
npm run bs:android
# or
npm run bs:ios
```

4. Use `.env` for test credentials

Create a `.env` file in the repo root with the following values:

```bash
DRAFTHOUSE_EMAIL=test@example.com
DRAFTHOUSE_PASSWORD=password
```

The test runner loads `.env` automatically and uses those values in `tests/example.spec.ts`.

Notes
- The BrowserStack script uses the Playwright websocket endpoint provided by BrowserStack. Ensure your BrowserStack plan supports Playwright mobile devices.
- Page objects are under `src/page-objects` and tests under `tests`.
