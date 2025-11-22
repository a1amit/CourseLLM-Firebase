import * as fs from 'fs/promises';
import * as path from 'path';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/markdown-renderer';

async function getMaterialContent(slug: string) {
  const filePath = path.join(process.cwd(), 'output', 'materials', slug);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

export default async function MaterialContentPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const content = await getMaterialContent(slug);

  if (!content) {
    notFound();
  }

  const title = slug.replace(/_/g, ' ').replace('.md', '');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 capitalize">{title}</h1>
      <div className="prose dark:prose-invert max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}