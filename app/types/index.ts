export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: 'article' | 'video';
    title?: string;
    timestamp?: number;
  };
}

export interface SearchResult {
  content: string;
  score: number;
  metadata: ContentChunk['metadata'];
}

// For future implementation of features
export interface FeatureFlags {
  enableWalletIntegration: boolean;
  enableLiveData: boolean;
  enablePersonalization: boolean;
} 