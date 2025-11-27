import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, requireRole, extractBearerToken } from '@/lib/server-auth';
import { generatePersonalizedAssessment } from '@/ai/flows/personalized-learning-assessment';

export async function POST(request: NextRequest) {
  try {
    // 1. Extract and verify auth token
    const authHeader = request.headers.get('Authorization');
    const idToken = extractBearerToken(authHeader);
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' }, 
        { status: 401 }
      );
    }
    
    const user = await verifyAuthToken(idToken);
    
    // 2. Check role authorization (only students can request assessments)
    requireRole(user, ['student']);
    
    // 3. Parse and validate request body
    const body = await request.json();
    const { studentLearningPath, courseContent, studentQuestionsAndAnswers, learningObjectives } = body;
    
    if (!studentLearningPath || !courseContent || !studentQuestionsAndAnswers || !learningObjectives) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // 4. Execute the personalized assessment flow
    const result = await generatePersonalizedAssessment({
      studentLearningPath,
      courseContent,
      studentQuestionsAndAnswers,
      learningObjectives,
    });
    
    // 5. Log for analytics
    console.log(JSON.stringify({
      event: 'personalized_assessment',
      userId: user.uid,
      timestamp: new Date().toISOString(),
    }));
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Personalized assessment error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Token expired. Please sign in again.' }, { status: 401 });
    }
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (error.message?.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

