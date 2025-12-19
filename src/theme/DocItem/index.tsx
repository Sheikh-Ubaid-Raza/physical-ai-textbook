import React, { useState, useEffect } from 'react';
import OriginalDocItem from '@theme-original/DocItem';
import SmartToolbar from '../../components/SmartToolbar/SmartToolbar';
import { useLocation } from '@docusaurus/router';

// Simple component to extract text content from React children
const extractTextContent = (children) => {
  let text = '';

  const processChildren = (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child + ' ';
    } else if (React.isValidElement(child)) {
      if (child.props.children) {
        React.Children.forEach(child.props.children, processChildren);
      }
    } else if (Array.isArray(child)) {
      child.forEach(processChildren);
    }
  };

  React.Children.forEach(children, processChildren);
  return text.trim();
};

export default function DocItem(props) {
  const { content: DocContent } = props;
  const { metadata } = DocContent;
  const { frontMatter } = metadata;
  const location = useLocation();
  const [currentContent, setCurrentContent] = useState('');
  const [contentTitle, setContentTitle] = useState('');

  // Extract content from the documentation
  useEffect(() => {
    if (DocContent) {
      // Extract the title from the content
      if (DocContent.components && DocContent.components.DocContent) {
        // Try to extract content text from the component
        const extractedText = extractTextContent(DocContent.components.DocContent);
        setCurrentContent(extractedText.substring(0, 1000)); // Limit to first 1000 chars
      }

      // Get the title from frontmatter or metadata
      setContentTitle(frontMatter.title || metadata.title || '');
    }
  }, [DocContent, frontMatter, metadata]);

  // Check if we're on a docs page (not on the main landing page)
  const isDocsPage = location.pathname.includes('/docs/') && !location.pathname.endsWith('/docs');

  // Function to update content after personalization/translation
  const handleContentChange = (newContent) => {
    setCurrentContent(newContent);
  };

  return (
    <>
      {isDocsPage && (
        <div className="smart-toolbar-container">
          <SmartToolbar
            currentContent={currentContent}
            onContentChange={handleContentChange}
            contentType="markdown"
            context={{
              userBackground: null, // Temporarily set to null to avoid auth context requirement
              page: metadata?.permalink,
              title: contentTitle
            }}
          />
        </div>
      )}
      <OriginalDocItem {...props} />
    </>
  );
}