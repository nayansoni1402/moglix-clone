const { chromium } = require('playwright');

async function discoverApi() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api-gt') && url.includes('search')) {
      console.log('Search API Response:', url);
      try {
        const json = await response.json();
        console.log('Keys:', Object.keys(json));
        if (json.data && json.data.products) {
          console.log('FOUND PRODUCTS!');
        }
      } catch (e) {}
    }
  });

  await page.goto('https://www.moglix.com/safety-shoes/211010000', { waitUntil: 'networkidle' });
  
  // Scroll down
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000);
  }
  
  await browser.close();
}

discoverApi();
