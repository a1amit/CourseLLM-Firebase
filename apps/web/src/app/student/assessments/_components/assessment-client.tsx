"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { courses } from '@/lib/mock-data';

type AssessmentResult = {
  assessment: string;
  suggestedAreasForImprovement: string;
};

export function AssessmentClient() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAssessment = async () => {
    setAssessmentResult(null);
    setIsLoading(true);
    
    try {
      const dummyInput = {
        studentLearningPath: "The student completed 'Introduction to Python' and struggled with recursion but excelled at loops. They frequently asked questions about algorithmic complexity in 'Data Structures & Algorithms'.",
        courseContent: JSON.stringify(courses),
        studentQuestionsAndAnswers: "Q: What is the difference between a list and a tuple? A: A list is mutable, while a tuple is immutable.",
        learningObjectives: "Understand core CS concepts, apply them to solve problems, analyze algorithm efficiency."
      };
      
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummyInput),
      });

      if (!response.ok) {
        throw new Error("Failed to generate assessment");
      }

      const result = await response.json();
      setAssessmentResult(result);
    } catch (error) {
      console.error("Failed to generate assessment:", error);
      // In a real app, you'd show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline">Personalized Assessment</h1>
          <p className="text-muted-foreground">
            Get AI-powered feedback on your learning journey so far.
          </p>
        </div>
        <Button onClick={handleGenerateAssessment} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate New Assessment
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[20rem]">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="font-semibold">Generating your assessment...</p>
              <p className="text-sm">This may take a moment. The AI is analyzing your progress.</p>
            </div>
          )}

          {!isLoading && !assessmentResult && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[20rem]">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <p className="font-semibold">Ready for your assessment?</p>
              <p className="text-sm">Click the button above to generate a new personalized report.</p>
            </div>
          )}

          {assessmentResult && (
            <div className="space-y-6 animate-in fade-in-50">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Areas of Strength
                </h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{assessmentResult.assessment}</p>
              </div>
              <Separator />
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  Suggestions for Improvement
                </h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{assessmentResult.suggestedAreasForImprovement}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
