import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatResponse, ChatRequest, ChatWidgetProps } from './types';
import './ChatWidget.css';

const ChatWidget: React.FC<ChatWidgetProps> = ({
  initialMessages = [],
  backendUrl = 'http://localhost:8000/api/v1', // Fixed URL to point to backend
  className = '',
  style
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage if available
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatWidgetMessages');
      if (savedMessages) {
        try {
          return JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }
    }
    return initialMessages;
  });

  const [inputValue, setInputValue] = useState('');

  const [sessionId, setSessionId] = useState<string | null>(() => {
    // Try to load sessionId from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatWidgetSessionId');
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Changed to isOpen for FAB
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Set up text selection listener
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const serializableMessages = messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }));
        localStorage.setItem('chatWidgetMessages', JSON.stringify(serializableMessages));
      } catch (e) {
        console.error('Error saving messages to localStorage:', e);
      }
    }
  }, [messages]);

  // Save sessionId to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionId) {
        localStorage.setItem('chatWidgetSessionId', sessionId);
      } else {
        localStorage.removeItem('chatWidgetSessionId');
      }
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the request
      const request: ChatRequest = {
        message: inputValue,
        sessionId: sessionId || undefined,
        selectedText: selectedText || undefined,
      };

      // Send the request to the backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Get the error details from the response
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data: ChatResponse = await response.json();

      // Update session ID if new one was provided
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      // Add assistant message to the chat
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);

      // Create a more descriptive error message based on the error type
      let errorMessageText = '';
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessageText = 'Network error: Unable to connect to the server. Please check if the backend is running on http://localhost:8000';
      } else {
        errorMessageText = err.message || 'Please try again.';
      }

      setError(`Failed to send message. Error: ${errorMessageText}`);

      // Add error message to the chat with more details
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error processing your request: ${errorMessageText}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedText(null); // Clear selected text after sending
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatWidgetMessages');
      localStorage.removeItem('chatWidgetSessionId');
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) - Always visible when chat is closed */}
      {!isOpen && (
        <button
          className="chat-fab"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <span className="chat-fab-icon">💬</span>
        </button>
      )}

      {/* Chat Interface - Only visible when isOpen is true */}
      {isOpen && (
        <div
          className={`chat-widget-container ${className}`}
          style={style}
        >
          <div className="chat-widget-header">
            <h3 className="chat-widget-title">AI Textbook Assistant</h3>
            <button
              className="chat-widget-close"
              onClick={closeChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-widget-body">
            <div className="chat-widget-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                  <p className="message-content">{message.content}</p>
                  {message.role === 'assistant' && selectedText && (
                    <div className="sources-list">
                      <div className="source-item"><strong>Context:</strong> "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="message message-assistant loading-indicator">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="message message-assistant error-message">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="chat-widget-input-area" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about the textbook..."
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
                }}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!inputValue.trim() || isLoading}
              >
                <span>➤</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;