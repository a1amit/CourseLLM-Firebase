import {NextRequest, NextResponse} from 'next/server';
import { revalidatePath } from 'next/cache';
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

    if (files) {
      for (const file of files) {
        const text = await extractText(file);
        // Pre-chunk the content by Markdown headings
        const chunks = text.split(/(?=^#{1,6} )/m).filter(Boolean); // Split on lines starting with #, ##, etc.
        rawContent += chunks.join('\n\n---\n\n'); // Join chunks with a clear separator
      }
    }

    console.log("==================================");
    console.log("CONTENT BEING SENT TO GENKIT FLOW:");
    console.log(rawContent.substring(0, 500) + "..."); // Log the first 500 chars
    console.log("==================================");

    const result = await chunkMaterialsFlow({ files: [rawContent], courseId, clearExisting });

    if (courseId) {
        revalidatePath(`/student/courses/${courseId}`);
        revalidatePath(`/student/materials/courses/${courseId}`);
    } else {
        // Revalidate the generic demo materials page
        revalidatePath('/student/materials');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in chunking route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to process and chunk materials.', details: errorMessage }, { status: 500 });
  }
}