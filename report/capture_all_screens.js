import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureAllScreens() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 960 }
  });

  const rootDir = path.join(__dirname, '..');
  const repDir = path.join(__dirname);

  // 1. Full Homepage
  console.log('Capturing full homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(repDir, 'screen_01_homepage.png') });

  // 2. Focused Target Fields (5 + 5 lists)
  console.log('Capturing target fields section...');
  const fieldsSection = page.locator('.domain-tags-wrapper');
  await fieldsSection.screenshot({ path: path.join(repDir, 'screen_02_target_fields.png') });

  // 3. File Selected / Ready State
  console.log('Capturing file selected state...');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(rootDir, 'test-samples', 'frontend_resume.pdf'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(repDir, 'screen_03_file_selected.png') });

  // 4. Analysis Result: Frontend Developer
  console.log('Capturing Frontend Developer result...');
  await page.locator('button.primary-analyze-btn').click();
  await page.waitForSelector('.result-glass-card', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(repDir, 'screen_04_result_frontend.png') });

  // 5. Analysis Result: Data Analyst
  console.log('Capturing Data Analyst result...');
  await page.locator('.action-reset-btn').click();
  await page.waitForTimeout(500);
  await page.locator('input[type="file"]').setInputFiles(path.join(rootDir, 'test-samples', 'data_analyst_resume.pdf'));
  await page.waitForTimeout(400);
  await page.locator('button.primary-analyze-btn').click();
  await page.waitForSelector('.result-glass-card', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(repDir, 'screen_05_result_data_analyst.png') });

  // 6. Analysis Result: UI/UX Designer
  console.log('Capturing UI/UX Designer result...');
  await page.locator('.action-reset-btn').click();
  await page.waitForTimeout(500);
  await page.locator('input[type="file"]').setInputFiles(path.join(rootDir, 'test-samples', 'ui_ux_resume.pdf'));
  await page.waitForTimeout(400);
  await page.locator('button.primary-analyze-btn').click();
  await page.waitForSelector('.result-glass-card', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(repDir, 'screen_06_result_ui_ux.png') });

  // 7. Analysis Result: Full Stack Developer
  console.log('Capturing Full Stack Developer result...');
  await page.locator('.action-reset-btn').click();
  await page.waitForTimeout(500);
  await page.locator('input[type="file"]').setInputFiles(path.join(rootDir, 'test-samples', 'fullstack_resume.pdf'));
  await page.waitForTimeout(400);
  await page.locator('button.primary-analyze-btn').click();
  await page.waitForSelector('.result-glass-card', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(repDir, 'screen_07_result_fullstack.png') });

  console.log('All 7 application photos captured successfully!');
  await browser.close();
}

captureAllScreens().catch(err => {
  console.error('Screen capture error:', err);
  process.exit(1);
});
