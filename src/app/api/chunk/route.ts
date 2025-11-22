import {NextRequest, NextResponse} from 'next/server';
import {chunkMaterialsFlow} from '@/ai/flows/chunk-materials';
import {extractText} from '@/lib/text-extractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, files, clearExisting } = body;

    if (!courseId && !files) {
      return NextResponse.json({ error: 'Either courseId or files must be provided.' }, { status: 400 });
    }

    let rawContent = '';

    if (courseId) {
      // In a real implementation, fetch file paths from the database using the courseId
      // and then extract text from each file.
      // For this example, we'll use mock data.
      const mockFilePaths = ['path/to/mock.pdf', 'path/to/mock.docx'];
      for (const path of mockFilePaths) {
        // This is a simplified example. In a real scenario, you would fetch the file content.
        const file = { path, content: Buffer.from('mock content').toString('base64') };
        rawContent += await extractText(file) + '\n\n';
      }
    } else if (files) {
      // Assuming 'files' is an array of objects with 'path' and 'content' (base64)
      for (const file of files) {
        rawContent += await extractText(file) + '\n\n';
      }
    }

    const result = await chunkMaterialsFlow({ files: [rawContent], clearExisting });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in chunking route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to process and chunk materials.', details: errorMessage }, { status: 500 });
  }
}