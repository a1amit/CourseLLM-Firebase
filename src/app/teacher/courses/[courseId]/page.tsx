import { getCourseById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { CourseManagementClient } from './_components/course-management-client';

export default async function ManageCoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  return <CourseManagementClient course={course} />;
}
