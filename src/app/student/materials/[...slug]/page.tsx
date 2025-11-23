import * as fs from 'fs/promises';
import * as path from 'path';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/markdown-renderer';

async function getMaterialContent(slug: string[]) {
  const filePath = path.join(process.cwd(), 'output', 'materials', ...slug);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

export default async function MaterialContentPage({ params }: { params: { slug: string[] } }) {
  const content = await getMaterialContent(params.slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <MarkdownRenderer content={content} />
    </div>
  );
}