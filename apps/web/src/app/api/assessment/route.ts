import { NextRequest, NextResponse } from "next/server";
import { generatePersonalizedAssessment } from "@/ai/flows/personalized-learning-assessment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentLearningPath, courseContent, studentQuestionsAndAnswers, learningObjectives } = body;

    if (!studentLearningPath || !courseContent || !studentQuestionsAndAnswers || !learningObjectives) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await generatePersonalizedAssessment({
      studentLearningPath,
      courseContent,
      studentQuestionsAndAnswers,
      learningObjectives,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Assessment API error:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment" },
      { status: 500 }
    );
  }
}
