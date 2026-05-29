import { chromium, webkit, Browser, Page } from 'playwright';
import { HomePage } from '../src/page-objects/HomePage';

function buildCaps(platform: string) {
  const common: any = {
    'browser': 'playwright',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME,
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'name': 'Drafthouse Mobile Smoke',
    'build': 'demo-web-automation'
  };

  if (platform === 'android') {
    return {
      ...common,
      browserstack: { playwrightVersion: '1.38.0' },
      'browserstack.device': 'Samsung Galaxy S21',
      'browserstack.osVersion': '11.0'
    };
  }

  // ios
  return {
    ...common,
    browserstack: { playwrightVersion: '1.38.0' },
    'browserstack.device': 'iPhone 13',
    'browserstack.osVersion': '15'
  };
}

async function run(platform: string) {
  if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    console.error('Please set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY');
    process.exit(1);
  }

  const caps = buildCaps(platform);
  const ws = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;

  let browser: Browser;
  if (platform === 'ios') {
    browser = await webkit.connect({ wsEndpoint: ws }) as unknown as Browser;
  } else {
    browser = await chromium.connect({ wsEndpoint: ws }) as unknown as Browser;
  }

  const context = await browser.newContext();
  const page: Page = await context.newPage();
  const home = new HomePage(page as any);
  await home.goto('https://drafthouse.com');
  await home.acceptCookies();
  const has = await home.hasFindATheaterLink();
  console.log('Find a Theater present:', has);

  await context.close();
  await browser.close();
}

const platform = process.argv[2] || 'android';
run(platform).catch((e) => {
  console.error(e);
  process.exit(1);
});
