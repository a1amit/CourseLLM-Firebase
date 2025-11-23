import * as fs from 'fs/promises';
import * as path from 'path';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';

async function getMaterialFiles(courseId?: string) {
  const baseDir = path.join(process.cwd(), 'output', 'materials');
  const dir = courseId ? path.join(baseDir, courseId) : baseDir;
  const manifestPath = path.join(dir, '_manifest.json');
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    return Array.isArray(manifest) ? manifest : [];
  } catch (error) {
    return [];
  }
}

export default async function MaterialsLayout({ children, params }: { children: React.ReactNode, params: { slug: string[] } }) {
  const isCourseMaterial = params.slug?.[0] === 'courses';
  const courseId = isCourseMaterial ? params.slug[1] : undefined;
  const materialFiles = await getMaterialFiles(courseId);
  const title = isCourseMaterial ? "Course Modules" : "Demo Materials";

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-muted/40 p-4 border-r flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              {title}
            </h2>
            <form action={async () => {
                'use server';
                revalidatePath('/student/materials', 'layout');
            }}>
                <Button type="submit" variant="ghost" size="sm">Refresh</Button>
            </form>
        </div>
        <nav className="flex flex-col gap-1">
          {materialFiles.map((file) => {
            const href = isCourseMaterial
              ? `/student/materials/courses/${courseId}/${file}`
              : `/student/materials/${file}`;
            return (
                <Link
                  href={href}
                  key={file}
                  className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors capitalize"
                >
                  {file.replace(/_/g, ' ').replace('.md', '')}
                </Link>
            );
          })}
           {materialFiles.length === 0 && (
            <p className="text-sm text-muted-foreground px-3 py-2">No AI-generated modules found.</p>
           )}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}