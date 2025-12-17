// Type definitions for the ChatWidget component

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Source {
  title: string;
  path: string;
  relevance: number;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  sources: Source[];
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  selectedText?: string;
  context?: {
    sourcePage?: string;
  };
}

export interface ChatWidgetProps {
  initialMessages?: Message[];
  backendUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}