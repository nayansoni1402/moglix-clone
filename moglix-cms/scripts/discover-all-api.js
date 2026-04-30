const { chromium } = require('playwright');

async function discoverAllApi() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api-gt')) {
      console.log('API Response:', url);
    }
  });

  await page.goto('https://www.moglix.com/safety-shoes/211010000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  await browser.close();
}

discoverAllApi();
