
import { createPdfFromContent } from './pdfGenerator';
import { extractContentForExport, formatSpeechContentForPdf } from './pdfFormatters';

// Re-export the functions for backward compatibility
export {
  createPdfFromContent,
  extractContentForExport,
  formatSpeechContentForPdf
};
