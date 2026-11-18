import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Extracts plain text from a PDF Buffer using pdfjs-dist
 * @param {Buffer} buffer
 * @returns {Promise<{text: string, numpages: number}>}
 */
export async function extractPdfText(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    disableFontFace: true
  });

  const pdf = await loadingTask.promise;
  const numpages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numpages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str || '');
    fullText += strings.join(' ') + '\n';
  }

  return {
    text: fullText,
    numpages
  };
}
