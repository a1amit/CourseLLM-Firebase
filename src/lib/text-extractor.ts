'use server';

import { z } from 'zod';

const FileSchema = z.object({
  path: z.string(),
  content: z.string(), // Base64 encoded content
});

export type File = z.infer<typeof FileSchema>;

async function extractTextFromMarkdown(file: File): Promise<string> {
  console.log(`Extracting text from Markdown: ${file.path}`);
  return Buffer.from(file.content, 'base64').toString('utf-8');
}

export async function extractText(file: File): Promise<string> {
  const extension = file.path.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'md':
    case 'txt':
      return extractTextFromMarkdown(file);
    default:
      // Now that the UI only allows .md, this is a fallback.
      console.warn(`Unsupported file type: ${extension}. Attempting to read as text.`);
      return Buffer.from(file.content, 'base64').toString('utf-8');
  }
}