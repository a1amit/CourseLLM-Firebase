import { getCourseById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CourseDetailClient } from './_components/course-detail-client';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

async function checkMaterialsExist(courseId: string) {
    const manifestPath = path.join(process.cwd(), 'output', 'materials', courseId, '_manifest.json');
    try {
        await fs.access(manifestPath);
        return true;
    } catch {
        return false;
    }
}

export default async function CourseDetailPage({ params }: { params: { courseId:string } }) {
    const { courseId } = await params;
    const course = getCourseById(courseId);

    if (!course) {
        notFound();
    }

    const materialsExist = await checkMaterialsExist(course.id);

    return (
        <div className="space-y-6">
            {materialsExist ? (
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
            <CourseDetailClient course={course} />
        </div>
    );
}
