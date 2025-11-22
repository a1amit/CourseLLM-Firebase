'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs/promises';
import * as path from 'path';
import { loadDocument } from '@/lib/document-loader';
import { indexDocuments } from '@/ai/vector-store';
import { Document } from 'genkit/doc';

// Defines the input schema for the course compiler flow.
const CourseCompilerInputSchema = z.object({
  courseId: z.string().optional().describe('The ID of the course to process materials from.'),
  files: z.array(z.string()).optional().describe('An array of file paths to be processed.'),
  clearExisting: z.boolean().optional().describe('Whether to clear existing materials before generating new ones.'),
});
export type CourseCompilerInput = z.infer<typeof CourseCompilerInputSchema>;

// Defines the schema for a single learning module.
const ModuleSchema = z.object({
  filename: z.string().describe('The filename for the module, e.g., introduction.md'),
  title: z.string().describe('The title of the module.'),
  content: z.string().describe('The Markdown content of the module.'),
});

// Defines the output schema for the course compiler flow.
const CourseCompilerOutputSchema = z.object({
  modules: z.array(ModuleSchema),
});
export type CourseCompilerOutput = z.infer<typeof CourseCompilerOutputSchema>;

// The AI prompt template for structuring the course content.
const curriculumArchitectPromptTemplate = `
**ROLE:**
You are a World-Class Curriculum Architect and Technical Instructor. Your goal is to take a chaotic dump of information and restructure it into a linear, intuitive learning path.
**INPUT:**
You will be provided with raw course materials.
**TASK:**
1.  **Analyze & Deconstruct:** Read all materials. Identify distinct concepts, definitions, code examples, and theoretical explanations.
2.  **Dependency Mapping:** Determine the logical prerequisites. (e.g., "Variables" must be taught before "Functions"; "HTTP" must be taught before "REST APIs").
3.  **Merge & Group:** Combine scattered references to the same topic into single, cohesive modules.
4.  **Draft Content:** Create detailed instructional content for each module in Markdown format.
**CRITICAL INSTRUCTION - THINKING PROCESS:**
Before generating the final content, you must output a <plan> block.
Inside <plan>:
- List the raw concepts identified.
- Create a dependency graph (Concept A -> Concept B).
- Propose a Table of Contents with file names (e.g., \`introduction.md\`, \`environment_setup.md\`). Use concise, snake_case filenames.
- Explain *why* you chose this order.
**OUTPUT FORMAT:**
After the <plan> block, output the content in a VALID JSON format as follows:
{
  "modules": [
    {
      "filename": "module_name.md",
      "title": "Module Title",
      "content": "# Module Title\\\\n\\\\n## Overview\\\\n..."
    }
  ]
}
`;

// Defines the AI prompt with input and output schemas.
const curriculumArchitectPrompt = ai.definePrompt({
    name: 'curriculumArchitectPrompt',
    input: {
        schema: z.object({
            rawContent: z.string().describe('The combined raw text content from all source documents.'),
        }),
    },
    output: {
        format: 'json',
        schema: CourseCompilerOutputSchema,
    },
    prompt: curriculumArchitectPromptTemplate,
});


/**
 * The main flow for compiling course materials.
 * It reads content from files, uses an AI to structure it into learning modules,
 * and saves the generated modules as markdown files.
 */
export const courseCompilerFlow = ai.defineFlow(
  {
    name: 'courseCompilerFlow',
    inputSchema: CourseCompilerInputSchema,
    outputSchema: CourseCompilerOutputSchema,
  },
  async (input: CourseCompilerInput) => {
    let rawContent = "No content provided";
    if (input.files && input.files.length > 0) {
        const fileContents = await Promise.all(
            input.files.map(async (filePath) => {
                try {
                    return await loadDocument(filePath);
                } catch (error) {
                    console.error(`Error processing file ${filePath}:`, error);
                    return `// Failed to process content from ${filePath} //`;
                }
            })
        );
        rawContent = fileContents.join('\\n\\n---\\n\\n'); // Separator for context
    }

    const { output } = await curriculumArchitectPrompt({ rawContent });

    if (!output) {
        throw new Error("Failed to generate course curriculum.");
    }

    // Define the output directory for the compiled course materials.
    const outputDir = path.join(process.cwd(), 'public', 'materials', input.courseId || 'default');

    if (input.clearExisting) {
        await fs.rm(outputDir, { recursive: true, force: true });
    }

    await fs.mkdir(outputDir, { recursive: true });

    const manifest = [];
    const documentsToIndex: Document<any>[] = [];
    for (const module of output.modules) {
      const filePath = path.join(outputDir, module.filename);
      await fs.writeFile(filePath, module.content);
      console.log(`Successfully created file: ${filePath}`);
      manifest.push(module.filename);
      documentsToIndex.push(
        Document.fromText(module.content, {
          title: module.title,
          courseId: input.courseId,
          filename: module.filename,
        })
      );
    }
    
    // Index the newly created documents.
    await indexDocuments(documentsToIndex);

    // Create a manifest file to list the modules in the correct order.
    const manifestPath = path.join(outputDir, '_manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Successfully created manifest file: ${manifestPath}`);

    console.log('Generated Modules:', JSON.stringify(output.modules, null, 2));

    return output;
  }
);
