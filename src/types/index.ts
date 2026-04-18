// ============================================================
// Core Type Definitions for Collaborative Document Editor
// ============================================================

export interface Document {
  id: string;
  owner_id: string;
  title: string;
  content: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SharedDocument {
  id: string;
  document_id: string;
  shared_with: string;
  created_at: string;
  // Joined fields
  documents?: Document;
}

export interface Upload {
  id: string;
  document_id: string | null;
  owner_id: string;
  filename: string;
  text_content: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ShareRequest {
  document_id: string;
  email: string;
}

export interface DocumentCreateResponse {
  id: string;
  title: string;
}

export interface UploadResponse {
  id: string;
  filename: string;
  text_content: string;
}
