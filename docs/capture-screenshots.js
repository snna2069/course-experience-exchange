// One-off script to capture consistently sized desktop screenshots for the
// README. Requires the frontend dev server running at http://localhost:3000.
// Run with: node docs/capture-screenshots.js
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'screenshots');
const VIEWPORT = { width: 1440, height: 900 };

async function shootFullPage(page, url, file) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
  console.log('Saved', file);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });

  await shootFullPage(page, 'http://localhost:3000/', 'home.png');
  await shootFullPage(page, 'http://localhost:3000/courses/cs-401', 'course-detail.png');
  await shootFullPage(page, 'http://localhost:3000/profile', 'profile.png');

  await browser.close();
})();
