import * as fs from 'fs/promises';
import * as path from 'path';
import Link from 'next/link';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown-renderer';

async function getCourseMaterials(courseId: string) {
  const dir = path.join(process.cwd(), 'output', 'materials', courseId);
  const manifestPath = path.join(dir, '_manifest.json');
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    const materials = await Promise.all(
        manifest.map(async (filename: string) => {
            const filePath = path.join(dir, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            return { filename, content };
        })
    );
    return materials;

  } catch (error) {
    return null;
  }
}

export default async function ViewCourseMaterialsPage({ params }: { params: { courseId: string } }) {
  const { courseId } = await params;
  const materials = await getCourseMaterials(courseId);

  if (!materials) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-semibold">Materials Not Generated</h1>
            <p className="text-muted-foreground mt-2">
                The AI-generated materials for this course have not been created yet.
            </p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-muted/40 p-4 border-r flex flex-col">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Course Modules
        </h2>
        <nav className="flex flex-col gap-1">
          {materials.map((material) => (
            <a
              href={`#${material.filename}`}
              key={material.filename}
              className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors capitalize"
            >
              {material.filename.replace(/_/g, ' ').replace('.md', '')}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-12">
            {materials.map(material => (
                <section key={material.filename} id={material.filename}>
                    <div className="prose dark:prose-invert max-w-none">
                        <MarkdownRenderer content={material.content} />
                    </div>
                </section>
            ))}
        </div>
      </main>
    </div>
  );
}