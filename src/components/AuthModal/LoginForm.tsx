import React, { useState } from 'react';
import { LoginRequest } from '../common/types';
import './AuthForm.css';

interface LoginFormProps {
  onAuthSuccess: (user: any) => void; // In a real app, you'd have a proper User type
}

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState<Omit<LoginRequest, 'password'> & { password: string }>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call the auth service
      // const response = await authService.login(formData);
      // onAuthSuccess(response.user);

      // For now, we'll simulate a successful login
      setTimeout(() => {
        onAuthSuccess({
          id: 'mock-user-id',
          email: formData.email,
          name: 'Mock User',
          software_background: 'Intermediate',
          hardware_background: 'Arduino',
          learning_goal: 'Learning robotics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;