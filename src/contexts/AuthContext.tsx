import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../components/common/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        // Clear invalid stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real implementation, you would call the auth service
    // const response = await authService.login({ email, password });
    // setUser(response.user);
    // setToken(response.session.token);
    // localStorage.setItem('authToken', response.session.token);
    // localStorage.setItem('authUser', JSON.stringify(response.user));

    // For now, we'll simulate a login
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      name: 'Mock User',
      software_background: 'Intermediate',
      hardware_background: 'Arduino',
      learning_goal: 'Learning robotics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setToken('mock-jwt-token');
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('authUser', JSON.stringify(mockUser));
  };

  const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }) => {
    // In a real implementation, you would call the auth service
    // const response = await authService.register(userData);
    // setUser(response.user);
    // setToken(response.session.token);
    // localStorage.setItem('authToken', response.session.token);
    // localStorage.setItem('authUser', JSON.stringify(response.user));

    // For now, we'll simulate a registration
    const mockUser: User = {
      id: 'mock-user-id',
      email: userData.email,
      name: userData.name,
      software_background: userData.software_background,
      hardware_background: userData.hardware_background,
      learning_goal: userData.learning_goal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setToken('mock-jwt-token');
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('authUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const updateUserProfile = async (profileData: Partial<User>) => {
    if (!user) return;

    // In a real implementation, you would call the auth service
    // const response = await authService.updateProfile(profileData);
    // setUser(response.user);
    // localStorage.setItem('authUser', JSON.stringify(response.user));

    // For now, we'll update the local user
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};