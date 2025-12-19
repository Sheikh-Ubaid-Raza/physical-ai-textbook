import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export function wrapRoot({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}