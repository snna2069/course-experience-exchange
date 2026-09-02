// One-off script to capture consistently sized desktop screenshots for the
// README. Requires the frontend dev server running at http://localhost:3000.
// Run with: node docs/capture-screenshots.js
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'screenshots');
const VIEWPORT = { width: 1440, height: 900 };
// Home and course detail sit side by side in the README, so they are captured
// at one fixed height to keep them exactly the same size.
const SHOWCASE_HEIGHT = 1600;

async function shoot(page, url, file, { height } = {}) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(OUT_DIR, file),
    // `clip` only reaches past the viewport when paired with fullPage.
    fullPage: true,
    ...(height ? { clip: { x: 0, y: 0, width: VIEWPORT.width, height } } : {}),
  });
  console.log('Saved', file);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });

  // Seed a demo user so the signed-in catalog and profile render fully.
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.setItem('showcaseUser', JSON.stringify({
    name: 'Sneha Nagaraju',
    email: 'sneha@example.com',
    joinYear: new Date().getFullYear(),
    savedCourses: 0,
    notesShared: 0,
  })));

  await shoot(page, 'http://localhost:3000/', 'home.png', { height: SHOWCASE_HEIGHT });
  await shoot(page, 'http://localhost:3000/courses/cs-401', 'course-detail.png', { height: SHOWCASE_HEIGHT });
  await shoot(page, 'http://localhost:3000/courses/new', 'add-course.png');
  await shoot(page, 'http://localhost:3000/profile', 'profile.png');

  await browser.close();
})();
