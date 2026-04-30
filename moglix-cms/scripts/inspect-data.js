const { chromium } = require('playwright');

async function inspectData() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.moglix.com/safety-shoes/211010000', { waitUntil: 'networkidle' });
  
  const data = await page.evaluate(() => {
    // Look for global variables that might contain product data
    return {
      windowData: window.__INITIAL_STATE__ || window.__NEXT_DATA__,
      scripts: Array.from(document.querySelectorAll('script[type="application/json"]')).map(s => s.innerText.slice(0, 100))
    };
  });

  console.log('Data found:', JSON.stringify(data, null, 2).slice(0, 1000));
  
  await browser.close();
}

inspectData();
