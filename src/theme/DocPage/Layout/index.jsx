import React, { useState } from 'react';
import OriginalDocPageLayout from '@theme-original/DocPage/Layout';
import SmartToolbar from '../../../components/SmartToolbar/SmartToolbar';

export default function DocPageLayout(props) {
  const [currentContent, setCurrentContent] = useState('');

  // Function to update content after personalization/translation
  const handleContentChange = (newContent) => {
    setCurrentContent(newContent);
  };

  // Get the page title from the route or metadata
  const pageTitle = typeof document !== 'undefined' ? document.title : '';

  return (
    <>
      <SmartToolbar
        currentContent={currentContent}
        onContentChange={handleContentChange}
        contentType="markdown"
        context={{
          userBackground: null, // Temporarily set to null to avoid auth context requirement
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          title: pageTitle
        }}
      />
      <OriginalDocPageLayout {...props} />
    </>
  );
}