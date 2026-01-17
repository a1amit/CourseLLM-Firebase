import { NextRequest, NextResponse } from "next/server";
import { socraticCourseChat } from "@/ai/flows/socratic-course-chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseMaterial, studentQuestion } = body;

    if (!courseMaterial || !studentQuestion) {
      return NextResponse.json(
        { error: "Missing required fields: courseMaterial and studentQuestion" },
        { status: 400 }
      );
    }

    const result = await socraticCourseChat({
      courseMaterial,
      studentQuestion,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Socratic chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
