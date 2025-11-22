"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Loader2 } from 'lucide-react';

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


  const handleChunkMaterials = async () => {
    setIsLoading(true);

    const fileContents = await Promise.all([
        fetch('/demo_materials/01_intro.txt').then(res => res.text()),
        fetch('/demo_materials/02_variables.txt').then(res => res.text())
    ]);

    const files = [
        { path: '01_intro.txt', content: btoa(fileContents[0]) },
        { path: '02_variables.txt', content: btoa(fileContents[1]) }
    ];

    try {
      const response = await fetch('/api/chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, clearExisting: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to chunk materials');
      }

      const result = await response.json();
      console.log("Chunking result:", result);

      toast({
        title: "Chunking Successful!",
        description: `${result.modules.length} modules were created.`,
        duration: 5000,
      });
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
    <>
        {isLoading && <LoadingOverlay elapsedTime={elapsedTime} />}
        <Button onClick={handleChunkMaterials} variant="secondary" className="w-full mt-4" disabled={isLoading}>
            <Rocket className="mr-2 h-4 w-4" /> Run Chunking Demo
        </Button>
    </>
  );
}