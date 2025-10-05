// API Base URL - will use Vite proxy in development
const API_BASE = '/api';

// Types
export interface ArticleCoords {
  id: string;
  x: number;
  y: number;
  z: number;
  title?: string;
  topic?: string;
}

export interface ChatRequest {
  topic?: string;
  question: string;
}

export interface TopicRequest {
  question: string;
}

// RAG API
export const ragApi = {
  /**
   * Find the most relevant topic for a given question
   */
  async findTopic(question: string): Promise<string> {
    const response = await fetch(`${API_BASE}/rag/find-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });

    if (!response.ok) {
      throw new Error(`Failed to find topic: ${response.statusText}`);
    }

    return response.text();
  },

  /**
   * Ask a question about a specific topic
   */
  async askTopic(topic: string, question: string): Promise<string> {
    const response = await fetch(`${API_BASE}/rag/ask-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, question }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ask topic: ${response.statusText}`);
    }

    return response.text();
  },

  /**
   * Add a text chunk to the vector store
   */
  async addChunk(id: string, text: string): Promise<string> {
    const response = await fetch(`${API_BASE}/rag/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, text }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add chunk: ${response.statusText}`);
    }

    return response.text();
  },
};

// UMAP API
export const umapApi = {
  /**
   * Get coordinates for a specific article
   */
  async getArticleCoords(id: string): Promise<ArticleCoords | null> {
    const response = await fetch(`${API_BASE}/umap/coords/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to get article coords: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get all article coordinates for visualization
   */
  async getAllArticles(): Promise<ArticleCoords[]> {
    const response = await fetch(`${API_BASE}/umap/articles`);

    if (!response.ok) {
      throw new Error(`Failed to get all articles: ${response.statusText}`);
    }

    return response.json();
  },
};

// Helper function for error handling
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
