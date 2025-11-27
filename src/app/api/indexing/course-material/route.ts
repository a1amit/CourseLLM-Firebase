import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, requireRole, extractBearerToken } from '@/lib/server-auth';
import { optimizedIndexingFlow } from '@/ai/flows/optimized-indexing';

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
    
    // 2. Check role authorization (only teachers can index content)
    requireRole(user, ['teacher']);
    
    // 3. Parse and validate request body
    const body = await request.json();
    const { courseId, documentTitle, markdownContent } = body;
    
    if (!courseId || !documentTitle || !markdownContent) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, documentTitle, and markdownContent' }, 
        { status: 400 }
      );
    }
    
    // 4. Execute the indexing flow
    const result = await optimizedIndexingFlow({ courseId, documentTitle, markdownContent });
    
    // 5. Log for analytics
    console.log(JSON.stringify({
      event: 'course_material_indexed',
      userId: user.uid,
      courseId,
      documentTitle,
      chunksCreated: result.chunksCreated,
      timestamp: new Date().toISOString(),
    }));
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Course indexing error:', error);
    
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

