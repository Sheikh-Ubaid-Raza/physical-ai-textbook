// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  software_background: 'Beginner' | 'Intermediate' | 'Advanced';
  hardware_background: 'None' | 'Arduino' | 'RaspberryPi';
  learning_goal?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  session: {
    token: string;
    expires_at: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  software_background: 'Beginner' | 'Intermediate' | 'Advanced';
  hardware_background: 'None' | 'Arduino' | 'RaspberryPi';
  learning_goal?: string;
}

export interface UpdateProfileRequest {
  software_background?: 'Beginner' | 'Intermediate' | 'Advanced';
  hardware_background?: 'None' | 'Arduino' | 'RaspberryPi';
  learning_goal?: string;
}

// Content personalization types
export interface PersonalizeRequest {
  chapter_content: string;
  user_id: string;
  chapter_id: string;
  personalization_level?: string;
}

export interface PersonalizeResponse {
  personalized_content: string;
  user_profile_used: {
    software_background: string;
    hardware_background: string;
  };
  processing_time: number;
  timestamp: string;
}

// Translation types
export interface TranslateRequest {
  chapter_content: string;
  chapter_id: string;
  translation_mode?: 'script' | 'roman';
  preserve_technical_terms?: boolean;
}

export interface TranslateResponse {
  translated_content: string;
  translation_stats: {
    original_word_count: number;
    translated_word_count: number;
    technical_terms_preserved: string[];
  };
  processing_time: number;
  timestamp: string;
}

export interface TranslationChunk {
  chunk: string;
  progress: number;
  chunk_id: number;
}

// Session types
export interface Session {
  token: string;
  expires_at: string;
}

// Error types
export interface APIError {
  error: string;
  details?: string;
}