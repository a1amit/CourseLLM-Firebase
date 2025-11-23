'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs/promises';
import * as path from 'path';

const ChunkMaterialsInputSchema = z.object({
  courseId: z.string().optional().describe('The ID of the course to process materials from.'),
  files: z.array(z.string()).optional().describe('An array of file paths or content for custom file uploads.'),
  clearExisting: z.boolean().optional().describe('Whether to clear existing materials before generating new ones.'),
});
export type ChunkMaterialsInput = z.infer<typeof ChunkMaterialsInputSchema>;

const ModuleSchema = z.object({
  filename: z.string().describe('The filename for the module, e.g., introduction.md'),
  title: z.string().describe('The title of the module.'),
  content: z.string().describe('The Markdown content of the module.'),
});

const ChunkMaterialsOutputSchema = z.object({
  modules: z.array(ModuleSchema),
});
export type ChunkMaterialsOutput = z.infer<typeof ChunkMaterialsOutputSchema>;

const chunkingPrompt = ai.definePrompt({
    name: 'chunkingPrompt',
    input: {
        schema: z.object({
            rawContent: z.string().describe('The combined raw text content from all source documents.'),
        }),
    },
    output: {
        format: 'json',
        schema: ChunkMaterialsOutputSchema,
    },
    prompt: `
**ROLE:**
You are a World-Class Curriculum Architect and Technical Instructor. Your goal is to take a chaotic dump of information and restructure it into a linear, intuitive learning path.

**INPUT:**
You will be provided with the following raw course materials:

{{rawContent}}

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
- Propose a Table of Contents with file names (e.g., "introduction.md", "environment_setup.md"). Use concise, snake_case filenames.
- CRITICAL: Do NOT add number prefixes like "01_" or "02_" to the filenames.
- Explain *why* you chose this order.

**OUTPUT FORMAT:**
After the <plan> block, output the content in a VALID JSON format as follows:
{
  "modules": [
    {
      "filename": "module_name.md",
      "title": "Module Title",
      "content": "# Module Title\\n\\n## Overview\\n..."
    }
  ]
}
`,
});


export const chunkMaterialsFlow = ai.defineFlow(
  {
    name: 'chunkMaterialsFlow',
    inputSchema: ChunkMaterialsInputSchema,
    outputSchema: ChunkMaterialsOutputSchema,
  },
  async (input: ChunkMaterialsInput) => {
    const rawContent = input.files?.join('\n\n') || "No content provided";

    console.log("**********************************");
    console.log("CONTENT RECEIVED BY GENKIT FLOW:");
    console.log(rawContent.substring(0, 500) + "..."); // Log the first 500 chars
    console.log("**********************************");

    const { output } = await chunkingPrompt({ rawContent });

    if (!output) {
        throw new Error("Failed to generate chunked materials.");
    }

    // Save the generated markdown files to storage.
    const baseDir = path.join(process.cwd(), 'output', 'materials');
    const outputDir = input.courseId ? path.join(baseDir, input.courseId) : baseDir;

    if (input.clearExisting) {
        await fs.rm(outputDir, { recursive: true, force: true });
    }

    await fs.mkdir(outputDir, { recursive: true });

    const manifest = [];
    for (const module of output.modules) {
      const filePath = path.join(outputDir, module.filename);
      await fs.writeFile(filePath, module.content);
      console.log(`Successfully created file: ${filePath}`);
      manifest.push(module.filename);
    }

    // Create a manifest file to preserve the order
    const manifestPath = path.join(outputDir, '_manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Successfully created manifest file: ${manifestPath}`);

    console.log('Generated Modules:', JSON.stringify(output.modules, null, 2));

    return output;
  }
);