import React, { useState } from 'react';
import { RegisterRequest } from '../common/types';
import './AuthForm.css';

interface RegisterFormProps {
  onAuthSuccess: (user: any) => void; // In a real app, you'd have a proper User type
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    name: '',
    password: '',
    software_background: 'Beginner',
    hardware_background: 'None',
    learning_goal: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      // const response = await authService.register(formData);
      // onAuthSuccess(response.user);

      // For now, we'll simulate a successful registration
      setTimeout(() => {
        onAuthSuccess({
          id: 'mock-user-id',
          email: formData.email,
          name: formData.name,
          software_background: formData.software_background,
          hardware_background: formData.hardware_background,
          learning_goal: formData.learning_goal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      console.error('Registration error:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-input-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

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

      <div className="auth-input-group">
        <label htmlFor="software_background">Software Background</label>
        <select
          id="software_background"
          name="software_background"
          value={formData.software_background}
          onChange={handleChange}
          required
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="auth-input-group">
        <label htmlFor="hardware_background">Hardware Background</label>
        <select
          id="hardware_background"
          name="hardware_background"
          value={formData.hardware_background}
          onChange={handleChange}
          required
        >
          <option value="None">None</option>
          <option value="Arduino">Arduino</option>
          <option value="RaspberryPi">Raspberry Pi</option>
        </select>
      </div>

      <div className="auth-input-group">
        <label htmlFor="learning_goal">Learning Goal (Optional)</label>
        <textarea
          id="learning_goal"
          name="learning_goal"
          value={formData.learning_goal}
          onChange={handleChange}
          placeholder="What are you hoping to learn?"
          rows={3}
        />
      </div>

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;