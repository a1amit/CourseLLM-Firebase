import { getCourseById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Presentation, BookOpen } from 'lucide-react';
import { ChatPanel } from './_components/chat-panel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getFirstMaterialFile(courseId: string): Promise<string | null> {
    const manifestPath = path.join(process.cwd(), 'output', 'materials', courseId, '_manifest.json');
    try {
        const manifestContent = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        return (Array.isArray(manifest) && manifest.length > 0) ? manifest[0] : null;
    } catch {
        return null;
    }
}

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }
  
  const firstMaterialFile = await getFirstMaterialFile(course.id);
  const courseMaterialString = course.materials.map(m => `Title: ${m.title}\nContent: ${m.content}`).join('\n\n---\n\n');

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)]">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold font-headline">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
        </div>
        
        {firstMaterialFile ? (
            <a href={`/materials/${course.id}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" /> View AI-Generated Course
                </Button>
            </a>
        ) : (
            <Button variant="outline" disabled>
                <BookOpen className="mr-2 h-4 w-4" /> AI Materials Not Yet Generated
            </Button>
        )}

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
             <Card className="flex flex-col">
                 <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                    <CardDescription>Review the materials for this course.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {course.materials.map(material => (
                                <div key={material.id} className="p-4 border rounded-lg bg-muted/50">
                                    <h3 className="flex items-center gap-2 font-semibold mb-2">
                                        {material.type === 'PDF' || material.type === 'DOC' ? <FileText className="h-5 w-5 text-primary"/> : <Presentation className="h-5 w-5 text-primary"/>}
                                        {material.title}
                                        <span className="text-xs font-normal text-muted-foreground ml-auto bg-background px-2 py-1 rounded-full border">{material.type}</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{material.content}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <div className="h-full">
                <ChatPanel courseMaterial={courseMaterialString} />
            </div>
        </div>
    </div>
  );
}
