// Fallback auth configuration that implements strict validation
// This serves as a bridge while we resolve the better-auth import issue

// Define the validation functions that will be used in the routes
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  return {
    valid: true,
    message: ''
  };
};

// Mock auth object to maintain compatibility with the existing code
export const auth = {
  hono: null, // This will be replaced with actual routes
  // Add any other required properties for compatibility
};