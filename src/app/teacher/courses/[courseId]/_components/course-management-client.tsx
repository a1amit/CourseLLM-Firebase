"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/lib/types";
import { FileText, Presentation, Upload, Trash2, Rocket, Loader2, UploadCloud, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function LoadingOverlay({ elapsedTime }: { elapsedTime: number }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
            <p className="text-white text-lg">Generating materials, please wait...</p>
            <p className="text-white text-2xl font-mono mt-2">
                {elapsedTime.toFixed(1)}s
            </p>
        </div>
    );
}

export function CourseManagementClient({ course: initialCourse }: { course: Course }) {
  const [course, setCourse] = useState(initialCourse);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [generatedModulesCount, setGeneratedModulesCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 0.1);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
  });

  const handleGenerateMaterials = async () => {
    if (selectedFiles.length === 0) {
        toast({
            title: "No files selected",
            description: "Please upload materials before generating.",
            variant: "destructive",
        });
        return;
    }
    
    setIsLoading(true);

    const filesPayload = await Promise.all(
        selectedFiles.map(async file => ({
            path: file.name,
            content: await toBase64(file),
        }))
    );

    try {
      const response = await fetch('/api/chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesPayload, courseId: course.id, clearExisting: true }),
      });

      if (!response.ok) throw new Error("Failed to generate materials.");

      const result = await response.json();
      setGeneratedModulesCount(result.modules.length);
      setShowSuccessAlert(true);
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating materials.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", course);
    toast({
      title: "Changes Saved",
      description: `Your changes to "${course.title}" have been saved.`,
    });
  };

  return (
    <>
        {isLoading && <LoadingOverlay elapsedTime={elapsedTime} />}
        <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generation Complete!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Successfully generated {generatedModulesCount} modules for "{course.title}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setShowSuccessAlert(false)}>OK</AlertDialogAction>
                    <a href={`/student/materials/courses/${course.id}`} target="_blank" rel="noopener noreferrer">
                        <AlertDialogAction>View Materials</AlertDialogAction>
                    </a>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>

          <Tabs defaultValue="materials">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">Course Materials</TabsTrigger>
              <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
            </TabsList>
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Materials</CardTitle>
                  <CardDescription>Upload and manage course files.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">AI-Powered Generation</h3>
                    <p className="text-sm text-muted-foreground">
                        Upload your course materials (Markdown files only) and the AI will generate a structured learning path.
                    </p>
                    <div
                        className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">
                            Click to browse or drag and drop files
                        </p>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".md"
                        />
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-sm">Selected Files:</h4>
                            <ul className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>{file.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedFiles(files => files.filter(f => f.name !== file.name))}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button onClick={handleGenerateMaterials} disabled={isLoading || selectedFiles.length === 0}>
                        <Rocket className="mr-2 h-4 w-4" /> Generate Course Materials
                    </Button>
                  </div>
                 </CardContent>
               </Card>
             </TabsContent>
            <TabsContent value="objectives">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Path Definition</CardTitle>
                  <CardDescription>Define the objectives, skills, and trajectories for this course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      placeholder="e.g., 1. Understand basic Python syntax..."
                      value={course.learningObjectives}
                      onChange={(e) => setCourse(prev => ({...prev, learningObjectives: e.target.value}))}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Learning Skills</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Problem-solving, Algorithmic thinking"
                      value={course.learningSkills}
                      onChange={(e) => setCourse(prev => ({...prev, learningSkills: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trajectories">Learning Trajectories</Label>
                    <Input
                      id="trajectories"
                      placeholder="e.g., Beginner -> Intermediate"
                      value={course.learningTrajectories}
                      onChange={(e) => setCourse(prev => ({...prev, learningTrajectories: e.target.value}))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </>
  );
}
