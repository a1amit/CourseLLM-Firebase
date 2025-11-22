"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Rocket } from 'lucide-react';

export function ChunkingClient() {
  const { toast } = useToast();

  const handleChunkMaterials = async () => {
    toast({
      title: "Chunking in Progress",
      description: "Please wait while we process your materials...",
    });

    // For this demo, we'll fetch the content of the local demo files.
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
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to chunk materials');
      }

      const result = await response.json();
      console.log("Chunking result:", result);

      toast({
        title: "Chunking Successful",
        description: `${result.modules.length} modules have been created. Check the server console for the output.`,
      });
    } catch (error) {
      console.error("Chunking error:", error);
      toast({
        title: "Chunking Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
   };

  return (
    <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">AI-Powered Chunking</h3>
        <p className="text-sm text-muted-foreground">
            Automatically convert your uploaded materials into a structured, step-by-step learning path.
        </p>
        <Button onClick={handleChunkMaterials}>
            <Rocket className="mr-2 h-4 w-4" /> Chunk Materials (Demo)
        </Button>
    </div>
  );
}