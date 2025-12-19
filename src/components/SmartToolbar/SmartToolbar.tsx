import React, { useState, useEffect } from 'react';
import AuthModal from '../AuthModal/AuthModal';
import PersonalizeButton from './PersonalizeButton';
import TranslateButton from './TranslateButton';
import './SmartToolbar.css';

interface SmartToolbarProps {
  currentContent: string;
  onContentChange: (newContent: string) => void;
  contentType?: string;
  context?: Record<string, any>;
}

const SmartToolbar: React.FC<SmartToolbarProps> = ({
  currentContent,
  onContentChange,
  contentType = 'text',
  context = {}
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [originalContent, setOriginalContent] = useState(currentContent);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Store original content when component mounts or content changes
  useEffect(() => {
    setOriginalContent(currentContent);
  }, [currentContent]);

  const handlePersonalize = (personalizedContent: string) => {
    onContentChange(personalizedContent);
    setActiveFeature('personalize');
    setIsLoading(false);
  };

  const handleTranslate = (translatedContent: string) => {
    onContentChange(translatedContent);
    setActiveFeature('translate');
    setIsLoading(false);
  };

  const handleRevert = () => {
    onContentChange(originalContent);
    setActiveFeature(null);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // For now, assume user is not authenticated to avoid auth context error
  const isAuthenticated = false;

  return (
    <div className="smart-toolbar">
      <div className="toolbar-buttons">
        {!isAuthenticated && (
          <button
            onClick={openAuthModal}
            className="toolbar-button auth-button"
            title="Log in to access personalization features"
          >
            <span className="button-icon">🔐</span>
            Login
          </button>
        )}

        <PersonalizeButton
          onPersonalize={handlePersonalize}
          currentContent={currentContent}
          contentType={contentType}
          context={context}
        />

        <TranslateButton
          onTranslate={handleTranslate}
          currentContent={currentContent}
          contentType={contentType}
        />

        {activeFeature && (
          <button
            onClick={handleRevert}
            className="toolbar-button revert-button"
            title="Revert to original content"
          >
            <span className="button-icon">↩️</span>
            Revert
          </button>
        )}
      </div>

      {showAuthModal && (
        <AuthModal onClose={closeAuthModal} />
      )}

      {activeFeature && (
        <div className="feature-indicator">
          {activeFeature === 'personalize' && 'Content personalized based on your background'}
          {activeFeature === 'translate' && 'Content translated to Urdu'}
        </div>
      )}
    </div>
  );
};

export default SmartToolbar;