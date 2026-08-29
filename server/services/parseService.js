const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Sanitizes and cleans raw text
 */
function sanitizeText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parses uploaded PDF buffer into plain text
 */
async function parsePDFBuffer(buffer) {
  try {
    const data = await pdfParse(buffer);
    return sanitizeText(data.text);
  } catch (error) {
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
}

/**
 * Parses uploaded DOCX buffer into plain text
 */
async function parseDOCXBuffer(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return sanitizeText(result.value);
  } catch (error) {
    throw new Error(`Failed to parse DOCX file: ${error.message}`);
  }
}

/**
 * Main parser entry point handling file buffer & mimetype
 */
async function parseUploadedFile(file) {
  if (!file) {
    throw new Error('No file provided for parsing');
  }

  const filename = file.originalname.toLowerCase();
  const mimetype = file.mimetype;

  if (filename.endsWith('.pdf') || mimetype === 'application/pdf') {
    return await parsePDFBuffer(file.buffer);
  } else if (
    filename.endsWith('.docx') ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    return await parseDOCXBuffer(file.buffer);
  } else if (filename.endsWith('.txt') || mimetype === 'text/plain') {
    return sanitizeText(file.buffer.toString('utf8'));
  } else {
    throw new Error('Unsupported file format. Please upload a .pdf, .docx, or .txt document.');
  }
}

module.exports = {
  sanitizeText,
  parsePDFBuffer,
  parseDOCXBuffer,
  parseUploadedFile,
};
