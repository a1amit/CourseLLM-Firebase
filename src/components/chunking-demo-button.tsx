"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Loader2, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

function LoadingOverlay({ elapsedTime }: { elapsedTime: number }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
            <p className="text-white text-lg">Chunking materials, please wait...</p>
            <p className="text-white text-2xl font-mono mt-2">
                {elapsedTime.toFixed(1)}s
            </p>
        </div>
    );
}

export function ChunkingDemoButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [lastDemoResult, setLastDemoResult] = useState<any>(null);
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

  const handleChunkMaterials = async () => {
    if (selectedFiles.length === 0) {
        toast({
            title: "No files selected",
            description: "Please select one or more files to chunk.",
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
        body: JSON.stringify({ files: filesPayload, clearExisting: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to chunk materials');
      }

      const result = await response.json();
      console.log("Chunking result:", result);
      setLastDemoResult(result); // Save the result

      toast({
        title: "Chunking Successful!",
        description: `${result.modules.length} modules were created.`,
        duration: 5000,
      });
      setSelectedFiles([]); // Clear files on success
    } catch (error) {
      console.error("Chunking error:", error);
      toast({
        title: "Chunking Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
   };

  return (
    <div className="w-full mt-4 space-y-4">
        {isLoading && <LoadingOverlay elapsedTime={elapsedTime} />}
        
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Chunk Custom Materials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Upload your own Markdown (.md) files to see the AI chunking in action.
                </p>
                <div
                    className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Click to browse or drag and drop files here
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
                                        <FileIcon className="h-4 w-4" />
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
            </CardContent>
        </Card>

        <Button onClick={handleChunkMaterials} className="w-full" disabled={isLoading || selectedFiles.length === 0}>
            <Rocket className="mr-2 h-4 w-4" /> Chunk {selectedFiles.length} File(s)
        </Button>

        {lastDemoResult && (
            <a href="/student/materials" className="w-full" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full">
                    View Last Generated Demo
                </Button>
            </a>
        )}
    </div>
  );
}