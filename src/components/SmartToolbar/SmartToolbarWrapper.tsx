import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import SmartToolbar from './SmartToolbar';

interface SmartToolbarWrapperProps {
  children?: React.ReactNode;
  contentType?: string;
}

const SmartToolbarWrapper: React.FC<SmartToolbarWrapperProps> = ({
  children,
  contentType = 'markdown'
}) => {
  const { user } = useContext(AuthContext);
  const [currentContent, setCurrentContent] = useState('');

  // Extract content from children if possible
  React.useEffect(() => {
    if (children && typeof children === 'string') {
      setCurrentContent(children.substring(0, 1000)); // Limit to first 1000 chars
    } else if (React.isValidElement(children)) {
      // If it's a React element, we'll just use a placeholder or allow manual content setting
      setCurrentContent('Documentation content...');
    }
  }, [children]);

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
  };

  return (
    <div className="smart-toolbar-wrapper">
      <SmartToolbar
        currentContent={currentContent}
        onContentChange={handleContentChange}
        contentType={contentType}
        context={{
          userBackground: user?.software_background,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          title: typeof document !== 'undefined' ? document.title : ''
        }}
      />
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default SmartToolbarWrapper;