'use server';

import { ai } from '@/ai/genkit';
import { searchDocuments } from '@/ai/vector-store';
import { z } from 'genkit';
import { Document } from 'genkit/doc';

const StudentChatbotInputSchema = z.object({
    question: z.string().describe('The student's question.'),
    courseId: z.string().describe('The ID of the course the student is asking about.'),
});

const StudentChatbotOutputSchema = z.object({
    answer: z.string().describe('The AI-generated answer.'),
    sources: z.array(z.string()).describe('The sources used to generate the answer.'),
});

const chatbotPromptTemplate = `
**ROLE:**
You are the CourseLLM, an expert AI Teaching Assistant. Your goal is to help students by answering their questions based *only* on the provided course materials.

**INSTRUCTIONS:**
1.  Analyze the user's question.
2.  Review the provided **context** from the course materials.
3.  Synthesize an answer that directly addresses the question using *only* the information from the context.
4.  If the context does not contain the answer, you MUST state that the information is not available in the course materials. DO NOT use any external knowledge.
5.  List the ` + '`filename`' + ` of each source document you used from the context.

**QUESTION:**
{question}

**CONTEXT:**
---
{context}
---
`;

export const studentChatbotFlow = ai.defineFlow(
    {
        name: 'studentChatbotFlow',
        inputSchema: StudentChatbotInputSchema,
        outputSchema: StudentChatbotOutputSchema,
    },
    async (input) => {
        // 1. Retrieve relevant documents from the vector store.
        const relevantDocs = await searchDocuments(input.question, 5);

        // 2. Format the retrieved documents as context for the prompt.
        const context = relevantDocs
            .map((doc: Document<any>) => {
                return `Source (filename: ${doc.metadata.filename}):\n${doc.text()}`;
            })
            .join('\n\n---\n\n');

        // 3. Generate the answer using the AI model.
        const llmResponse = await ai.generate({
            prompt: chatbotPromptTemplate,
            input: {
                question: input.question,
                context: context,
            },
        });

        const answer = llmResponse.text();

        // 4. Extract the sources from the retrieved documents.
        const sources = relevantDocs.map((doc: Document<any>) => doc.metadata.filename);

        return {
            answer,
            sources,
        };
    }
);
