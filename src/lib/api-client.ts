import { auth } from './firebase';
import type { SocraticCourseChatOutput } from '@/ai/flows/socratic-course-chat';
import type { PersonalizedAssessmentOutput } from '@/ai/flows/personalized-learning-assessment';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

/**
 * Makes an authenticated API call to our backend services.
 * Automatically attaches the current user's Firebase ID token.
 */
export async function authenticatedFetch(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get the ID token (will refresh automatically if expired)
  const idToken = await user.getIdToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
    ...options.headers,
  };
  
  return fetch(endpoint, {
    ...options,
    headers,
  });
}

/**
 * Helper to parse API response and throw on error
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
}

// =============================================================================
// Chat API - Socratic Course Chat Service
// =============================================================================

export const chatApi = {
  /**
   * Sends a message to the Socratic tutor and receives a guided response.
   * Only available to students.
   */
  async sendMessage(
    courseMaterial: string, 
    studentQuestion: string
  ): Promise<SocraticCourseChatOutput> {
    const response = await authenticatedFetch('/api/chat/socratic', {
      method: 'POST',
      body: JSON.stringify({ courseMaterial, studentQuestion }),
    });
    
    return handleResponse<SocraticCourseChatOutput>(response);
  },
};

// =============================================================================
// Assessment API - Personalized Learning Assessment Service
// =============================================================================

export type PersonalizedAssessmentInput = {
  studentLearningPath: string;
  courseContent: string;
  studentQuestionsAndAnswers: string;
  learningObjectives: string;
};

export const assessmentApi = {
  /**
   * Generates a personalized assessment based on the student's learning path.
   * Only available to students.
   */
  async generatePersonalized(
    input: PersonalizedAssessmentInput
  ): Promise<PersonalizedAssessmentOutput> {
    const response = await authenticatedFetch('/api/assessment/personalized', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    
    return handleResponse<PersonalizedAssessmentOutput>(response);
  },
};

// =============================================================================
// Indexing API - Course Material Indexing Service
// =============================================================================

export type IndexingResult = {
  chunksCreated: number;
  enrichedChunks: Array<{
    id: string;
    content: string;
    embedding: number[];
    metadata: {
      headerPath: string[];
      summary: string;
      keywords: string[];
      questions: string[];
    };
  }>;
};

export const indexingApi = {
  /**
   * Indexes course material for semantic search.
   * Only available to teachers.
   */
  async indexCourseMaterial(
    courseId: string, 
    documentTitle: string, 
    markdownContent: string
  ): Promise<IndexingResult> {
    const response = await authenticatedFetch('/api/indexing/course-material', {
      method: 'POST',
      body: JSON.stringify({ courseId, documentTitle, markdownContent }),
    });
    
    return handleResponse<IndexingResult>(response);
  },
};

// =============================================================================
// Combined API object for convenience
// =============================================================================

export const api = {
  chat: chatApi,
  assessment: assessmentApi,
  indexing: indexingApi,
};

export default api;

