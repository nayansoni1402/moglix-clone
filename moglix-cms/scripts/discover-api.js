const { chromium } = require('playwright');

async function discoverApi() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Monitoring network requests...');
  page.on('request', request => {
    const url = request.url();
    if (url.includes('api') || url.includes('json') || url.includes('graphql')) {
      if (!url.includes('google') && !url.includes('facebook') && !url.includes('hotjar')) {
        console.log('Potential API Request:', url);
      }
    }
  });

  await page.goto('https://www.moglix.com/safety-shoes/211010000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  await browser.close();
}

discoverApi();
