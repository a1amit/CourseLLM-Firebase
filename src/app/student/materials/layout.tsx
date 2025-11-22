import * as fs from 'fs/promises';
import * as path from 'path';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

async function getMaterialFiles() {
  const dir = path.join(process.cwd(), 'output', 'materials');
  const manifestPath = path.join(dir, '_manifest.json');
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    return Array.isArray(manifest) ? manifest : [];
  } catch (error) {
    // If manifest doesn't exist, fall back to reading directory
    try {
        const files = await fs.readdir(dir);
        return files.filter(file => file.endsWith('.md') && file !== '_manifest.json');
    } catch (dirError) {
        return [];
    }
  }
}

export default async function MaterialsLayout({ children }: { children: React.ReactNode }) {
  const materialFiles = await getMaterialFiles();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Course Modules
        </h2>
        <nav className="flex flex-col gap-1">
          {materialFiles.map((file, index) => (
            <Link
              href={`/student/materials/${file}`}
              key={file}
              className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              {file.replace(/_/g, ' ').replace('.md', '')}
            </Link>
          ))}
           {materialFiles.length === 0 && (
            <p className="text-sm text-muted-foreground px-3 py-2">No modules found.</p>
           )}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}