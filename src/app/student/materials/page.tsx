import { BookOpen } from 'lucide-react';

export default function MaterialsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold">Welcome to Your Course</h1>
      <p className="text-muted-foreground mt-2">
        Select a module from the sidebar to begin learning.
      </p>
    </div>
  );
}