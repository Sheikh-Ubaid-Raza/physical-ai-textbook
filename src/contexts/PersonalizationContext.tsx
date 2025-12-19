import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import PersonalizationService from '../services/personalizationService';
import TranslationService from '../services/translationService';

interface PersonalizationContextType {
  isPersonalizing: boolean;
  isTranslating: boolean;
  lastPersonalizedContent: string | null;
  lastTranslatedContent: string | null;
  personalizeContent: (content: string, contentType?: string, context?: Record<string, any>) => Promise<string>;
  translateContent: (content: string, targetLanguage?: string, preserveTechnicalTerms?: boolean, contentType?: string) => Promise<string>;
  clearCache: (userId: string) => Promise<void>;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

interface PersonalizationProviderProps {
  children: ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ children }) => {
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastPersonalizedContent, setLastPersonalizedContent] = useState<string | null>(null);
  const [lastTranslatedContent, setLastTranslatedContent] = useState<string | null>(null);

  const { token } = useAuth();
  const personalizationService = new PersonalizationService();
  const translationService = new TranslationService();

  const personalizeContent = useCallback(async (content: string, contentType: string = 'text', context?: Record<string, any>): Promise<string> => {
    if (!token) {
      throw new Error('User must be authenticated to personalize content');
    }

    setIsPersonalizing(true);
    try {
      const result = await personalizationService.personalizeContent(content, contentType, context);
      setLastPersonalizedContent(result.personalized_content);
      return result.personalized_content;
    } catch (error) {
      console.error('Error personalizing content:', error);
      throw error;
    } finally {
      setIsPersonalizing(false);
    }
  }, [token]);

  const translateContent = useCallback(async (
    content: string,
    targetLanguage: string = 'urdu',
    preserveTechnicalTerms: boolean = true,
    contentType: string = 'text'
  ): Promise<string> => {
    if (!token) {
      throw new Error('User must be authenticated to translate content');
    }

    setIsTranslating(true);
    try {
      const result = await translationService.translateContent(content, targetLanguage, preserveTechnicalTerms, contentType);
      setLastTranslatedContent(result.translated_content);
      return result.translated_content;
    } catch (error) {
      console.error('Error translating content:', error);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  }, [token]);

  const clearCache = useCallback(async (userId: string) => {
    if (!token) {
      throw new Error('User must be authenticated to clear cache');
    }

    try {
      await personalizationService.clearUserCache(userId);
      await translationService.clearUserTranslationCache(userId);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }, [token]);

  const value: PersonalizationContextType = {
    isPersonalizing,
    isTranslating,
    lastPersonalizedContent,
    lastTranslatedContent,
    personalizeContent,
    translateContent,
    clearCache,
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};