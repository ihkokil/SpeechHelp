
/**
 * Defines styles for PDF export
 */
export const pdfStyles = {
  container: `
    font-family: Arial, sans-serif; 
    margin: 20px; 
    line-height: 1.6;
  `,
  title: `
    font-size: 28px; 
    font-weight: bold; 
    margin-bottom: 8px; 
    color: #6b21a8;
  `,
  subtitle: `
    font-size: 14px; 
    color: #666; 
    margin-bottom: 16px;
  `,
  divider: `
    border: 1px solid #e5e7eb; 
    margin: 16px 0;
  `,
  heading1: `
    font-size: 24px; 
    font-weight: bold; 
    margin-bottom: 16px; 
    color: #6b21a8;
  `,
  heading2: `
    font-size: 20px; 
    font-weight: bold; 
    margin-top: 24px; 
    margin-bottom: 12px; 
    color: #6b21a8;
  `,
  heading3: `
    font-size: 18px; 
    font-weight: bold; 
    margin-top: 20px; 
    margin-bottom: 8px; 
    color: #6b21a8;
  `,
  bold: `
    font-weight: bold;
  `,
  italic: `
    font-style: italic;
  `,
  paragraph: `
    margin-bottom: 16px;
  `,
  inputsSection: `
    background-color: #f5f3ff; 
    padding: 16px; 
    border-radius: 6px; 
    margin-bottom: 24px; 
    border: 1px solid #e9d5ff;
  `,
  inputLabel: `
    font-weight: 500; 
    color: #7e22ce;
  `,
  inputValue: `
    color: #1f2937;
  `,
  inputItem: `
    margin-bottom: 8px;
  `
};

/**
 * PDF export options configuration
 */
export const pdfOptions = {
  margin: [15, 15, 15, 15],
  filename: 'speech.pdf', // This will be overridden with the actual title
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};
