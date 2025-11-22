'use server';

import * as fs from 'fs/promises';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import path from 'path';

/**
 * Extracts text content from a PDF file.
 * @param filePath The path to the PDF file.
 * @returns A promise that resolves to the extracted text.
 */
async function extractTextFromPdf(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
}

/**
 * Extracts text content from a DOCX file.
 * @param filePath The path to the DOCX file.
 * @returns A promise that resolves to the extracted text.
 */
async function extractTextFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
}

/**
 * Extracts text content from a plain text or markdown file.
 * @param filePath The path to the text file.
 * @returns A promise that resolves to the file's content.
 */
async function extractTextFromText(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
}

/**
 * Loads the raw text content from a file, using the appropriate parser
 * based on the file extension.
 * @param filePath The path to the file.
 * @returns A promise that resolves to the extracted text content.
 */
export async function loadDocument(filePath: string): Promise<string> {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case '.pdf':
            console.log(`Loading PDF: ${filePath}`);
            return extractTextFromPdf(filePath);
        case '.docx':
            console.log(`Loading DOCX: ${filePath}`);
            return extractTextFromDocx(filePath);
        case '.md':
        case '.txt':
            console.log(`Loading text file: ${filePath}`);
            return extractTextFromText(filePath);
        default:
            console.warn(`Unsupported file type: ${extension}. Reading as plain text.`);
            return extractTextFromText(filePath);
    }
}
