import React, { useState } from 'react';
import './SmartToolbar.css';

interface TranslateButtonProps {
  onTranslate: (translatedContent: string) => void;
  currentContent: string;
  targetLanguage?: string;
  preserveTechnicalTerms?: boolean;
  contentType?: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  onTranslate,
  currentContent,
  targetLanguage = 'urdu',
  preserveTechnicalTerms = true,
  contentType = 'text'
}) => {
  // For now, assume user is not authenticated to avoid auth context error
  const isAuthenticated = false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleTranslate = async () => {
    if (!isAuthenticated) {
      alert('Please log in to use the translation feature.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if we should use streaming or regular translation
      const useStreaming = currentContent.length > 1000; // Use streaming for longer content

      if (useStreaming) {
        await handleStreamingTranslation();
      } else {
        await handleRegularTranslation();
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate content. Please try again.');
      // Optionally revert to original content
      onTranslate(currentContent);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleRegularTranslation = async () => {
    const response = await fetch('/api/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Assuming JWT token
      },
      body: JSON.stringify({
        content: currentContent,
        target_language: targetLanguage,
        preserve_technical_terms: preserveTechnicalTerms,
        content_type: contentType
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const result = await response.json();
    onTranslate(result.translated_content);
  };

  const handleStreamingTranslation = async () => {
    setIsStreaming(true);

    const response = await fetch('/api/v1/translate/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Assuming JWT token
      },
      body: JSON.stringify({
        content: currentContent,
        target_language: targetLanguage,
        preserve_technical_terms: preserveTechnicalTerms,
        content_type: contentType
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let translatedContent = '';

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
                translatedContent += data.content;
                // Update content progressively (in a real implementation, this would be handled differently)
                // For now, we'll just accumulate and update at the end
              } else if (data.type === 'complete') {
                onTranslate(data.translated_content);
                return; // Exit the function when complete
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (e) {
              // Ignore malformed JSON lines
              console.warn('Malformed JSON line:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  return (
    <div className="translate-button-container">
      <button
        onClick={handleTranslate}
        disabled={isLoading || !isAuthenticated}
        className={`toolbar-button translate-button ${isLoading ? 'loading' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
        title={isAuthenticated
          ? "Translate this content to Urdu"
          : "Log in to translate content"}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            {isStreaming ? 'Translating...' : 'Translating...'}
          </>
        ) : (
          <>
            <span className="button-icon">🌐</span>
            Translate to Urdu
          </>
        )}
      </button>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;