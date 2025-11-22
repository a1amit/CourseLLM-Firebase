'use server';

import { z } from 'zod';

const FileSchema = z.object({
  path: z.string(),
  content: z.string(), // Base64 encoded content for binary files
});

export type File = z.infer<typeof FileSchema>;

async function extractTextFromPDF(file: File): Promise<string> {
  // Placeholder: In a real implementation, you would use a library like pdf-parse
  // to extract text from a PDF file.
  console.log(`Extracting text from PDF: ${file.path}`);
  return "Text from PDF";
}

async function extractTextFromDOCX(file: File): Promise<string> {
  // Placeholder: In a real implementation, you would use a library like mammoth
  // to extract text from a DOCX file.
  console.log(`Extracting text from DOCX: ${file.path}`);
  return "Text from DOCX";
}

async function extractTextFromTXT(file: File): Promise<string> {
  console.log(`Extracting text from TXT: ${file.path}`);
  return Buffer.from(file.content, 'base64').toString('utf-8');
}

async function extractTextFromMD(file: File): Promise<string> {
  console.log(`Extracting text from MD: ${file.path}`);
  return Buffer.from(file.content, 'base64').toString('utf-8');
}

export async function extractText(file: File): Promise<string> {
  const extension = file.path.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return extractTextFromPDF(file);
    case 'docx':
      return extractTextFromDOCX(file);
    case 'txt':
      return extractTextFromTXT(file);
    case 'md':
      return extractTextFromMD(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}