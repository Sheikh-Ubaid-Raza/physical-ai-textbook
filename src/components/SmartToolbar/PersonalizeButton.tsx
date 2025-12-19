import React, { useState } from 'react';
import './SmartToolbar.css';

interface PersonalizeButtonProps {
  onPersonalize: (personalizedContent: string) => void;
  currentContent: string;
  contentType?: string;
  context?: Record<string, any>;
}

const PersonalizeButton: React.FC<PersonalizeButtonProps> = ({
  onPersonalize,
  currentContent,
  contentType = 'text',
  context = {}
}) => {
  // For now, assume user is not authenticated to avoid auth context error
  const isAuthenticated = false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonalize = async () => {
    if (!isAuthenticated) {
      alert('Please log in to use the personalization feature.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the personalization API
      // For now, we'll simulate the API call
      const response = await fetch('/api/v1/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Assuming JWT token
        },
        body: JSON.stringify({
          content: currentContent,
          content_type: contentType,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`Personalization failed: ${response.statusText}`);
      }

      const result = await response.json();
      onPersonalize(result.personalized_content);
    } catch (err) {
      console.error('Personalization error:', err);
      setError('Failed to personalize content. Please try again.');
      // Optionally revert to original content
      onPersonalize(currentContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="personalize-button-container">
      <button
        onClick={handlePersonalize}
        disabled={isLoading || !isAuthenticated}
        className={`toolbar-button personalize-button ${isLoading ? 'loading' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
        title={isAuthenticated
          ? "Personalize this content based on your background"
          : "Log in to personalize content"}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Personalizing...
          </>
        ) : (
          <>
            <span className="button-icon">✨</span>
            Personalize
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

export default PersonalizeButton;