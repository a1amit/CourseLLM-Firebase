# Platform Capabilities

This spec defines the core platform capabilities for CourseLLM.

## Authentication
**Description**: Secure user authentication and role-based access control using Firebase Auth.
- Support for Google Sign-In
- Role-based claims (Student, Teacher, Admin)
- Protected routes and API endpoints based on roles

## Ingestion Service
**Description**: Specialized service for processing course materials and generating embeddings.
- File parsing and text extraction
- Semantic chunking (Chonkie)
- Embedding generation (Vertex AI / Local)
- Storage in Vector Store

## AI Tutor
**Description**: GenAI-powered tutoring interface for students.
- Socratic questioning style
- Context-aware answers based on course material
- Integration with Genkit for flow management

## Student Dashboard
**Description**: Main interface for students to access courses and assignments.
- Course progress tracking
- Assignment submission
- Access to AI Tutor

## Teacher Dashboard
**Description**: Interface for teachers to manage courses and view student analytics.
- Course creation and material upload
- Student progress monitoring
- Assignment grading

## Data Management
**Description**: Data handling using Firebase services.
- DataConnect for type-safe Firestore access
- Cloud Functions for backend logic
- Storage definitions for user content
