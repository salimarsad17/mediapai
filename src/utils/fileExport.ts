// Utility for seamless browser file downloads without window.open or window.alert

export const downloadFile = (filename: string, content: string, mimeType = 'text/plain;charset=utf-8') => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (err) {
    console.error('File download error:', err);
  }
};

export const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const formatCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(formatCell).join(',');
  const rowLines = rows.map(r => r.map(formatCell).join(',')).join('\n');
  const csvContent = '\uFEFF' + headerLine + '\n' + rowLines; // Add BOM for Excel UTF-8 support
  downloadFile(filename, csvContent, 'text/csv;charset=utf-8');
};

export const exportToDoc = (filename: string, title: string, content: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 2cm; }
          h1 { font-size: 16pt; color: #1e3a8a; text-align: center; text-transform: uppercase; }
          h2 { font-size: 13pt; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
          p { margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #94a3b8; padding: 6px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <hr/>
        ${content}
      </body>
    </html>
  `;
  downloadFile(filename, htmlContent, 'application/msword;charset=utf-8');
};
