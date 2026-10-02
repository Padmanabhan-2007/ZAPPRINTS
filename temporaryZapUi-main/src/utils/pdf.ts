import * as pdfjsLib from 'pdfjs-dist';

// Configure workerSrc for browser environments
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Counts the number of pages in a PDF file in the browser using PDF.js.
 * Throws an Error if the file cannot be parsed or if the page count is invalid.
 * NEVER falls back to default assumptions like 1 page.
 */
export const countPdfPagesClient = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data: typedArray,
    useWorkerFetch: false,
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (typeof numPages !== 'number' || isNaN(numPages) || numPages < 1) {
    throw new Error('Invalid page count detected');
  }

  return numPages;
};
