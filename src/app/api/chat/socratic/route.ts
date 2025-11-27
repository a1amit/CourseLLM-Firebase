import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, requireRole, extractBearerToken } from '@/lib/server-auth';
import { socraticCourseChat } from '@/ai/flows/socratic-course-chat';

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
    
    // 2. Check role authorization (only students can use the chat)
    requireRole(user, ['student']);
    
    // 3. Parse and validate request body
    const body = await request.json();
    const { courseMaterial, studentQuestion } = body;
    
    if (!courseMaterial || !studentQuestion) {
      return NextResponse.json(
        { error: 'Missing required fields: courseMaterial and studentQuestion' }, 
        { status: 400 }
      );
    }
    
    // 4. Execute the Socratic chat flow
    const result = await socraticCourseChat({ courseMaterial, studentQuestion });
    
    // 5. Log for analytics (could be sent to Analytics Service later)
    console.log(JSON.stringify({
      event: 'socratic_chat',
      userId: user.uid,
      questionLength: studentQuestion.length,
      timestamp: new Date().toISOString(),
    }));
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Socratic chat error:', error);
    
    // Handle specific error types
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

