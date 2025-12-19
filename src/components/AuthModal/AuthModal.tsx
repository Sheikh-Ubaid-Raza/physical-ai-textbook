import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void; // In a real app, you'd have a proper User type
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{isLoginView ? 'Sign In' : 'Sign Up'}</h2>
          <button className="auth-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="auth-modal-content">
          {isLoginView ? (
            <LoginForm onAuthSuccess={onAuthSuccess} />
          ) : (
            <RegisterForm onAuthSuccess={onAuthSuccess} />
          )}
        </div>

        <div className="auth-modal-footer">
          <p>
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button
              className="auth-modal-toggle-view"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;