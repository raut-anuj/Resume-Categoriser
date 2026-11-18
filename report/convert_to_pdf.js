import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportPdf() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage();
  const htmlPath = 'file:///' + path.join(__dirname, 'Project_Report.html').replace(/\\/g, '/');

  console.log('Loading HTML report into Edge...');
  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  console.log('Rendering 70-page PDF document...');
  const pdfPath = path.join(__dirname, 'Project_Report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    displayHeaderFooter: false
  });

  console.log('Successfully generated Project_Report.pdf!');
  await browser.close();
}

exportPdf().catch(err => {
  console.error('PDF Export Error:', err);
  process.exit(1);
});
