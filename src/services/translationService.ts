import { TranslateRequest, TranslateResponse } from '../components/common/types';

class TranslationService {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  async translateContent(
    content: string,
    targetLanguage: string = 'urdu',
    preserveTechnicalTerms: boolean = true,
    contentType: string = 'text'
  ): Promise<TranslateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          content,
          target_language: targetLanguage,
          preserve_technical_terms: preserveTechnicalTerms,
          content_type: contentType
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const result: TranslateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error in translation service:', error);
      throw error;
    }
  }

  async translateContentStream(
    content: string,
    onChunk: (chunk: string) => void,
    onProgress?: (progress: number) => void,
    targetLanguage: string = 'urdu',
    preserveTechnicalTerms: boolean = true,
    contentType: string = 'text'
  ): Promise<TranslateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/translate/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          content,
          target_language: targetLanguage,
          preserve_technical_terms: preserveTechnicalTerms,
          content_type: contentType
        })
      });

      if (!response.ok) {
        throw new Error(`Translation stream failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let fullResponse: TranslateResponse | null = null;
      let progress = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix

                if (data.type === 'chunk') {
                  onChunk(data.content);
                  progress += data.content.length;
                  onProgress?.(progress);
                } else if (data.type === 'complete') {
                  fullResponse = data;
                  break;
                } else if (data.type === 'error') {
                  throw new Error(data.message);
                }
              } catch (e) {
                // Ignore malformed JSON lines
                console.warn('Malformed JSON line:', line);
              }
            }
          }

          // Break outer loop if we received complete response
          if (fullResponse) break;
        }
      } finally {
        reader.releaseLock();
      }

      if (!fullResponse) {
        throw new Error('Incomplete response received');
      }

      return fullResponse;
    } catch (error) {
      console.error('Error in translation stream service:', error);
      throw error;
    }
  }

  async clearUserTranslationCache(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/translate/cache/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Cache clear failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error clearing translation cache:', error);
      throw error;
    }
  }
}

export default TranslationService;