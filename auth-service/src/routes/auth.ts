import { Hono } from 'hono';
import { hashPassword } from '../utils/password';
import { validateRegistration, validateLogin, requireAuth } from '../middleware/validation';
import { User } from '../models/user';

const app = new Hono();

// Registration endpoint
app.post('/register', validateRegistration, async (c) => {
  try {
    const validatedData = c.get('validatedData');

    // In a real implementation, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save user to database
    // 4. Generate JWT token

    // For now, we'll return a mock response that follows the API contract
    const mockUser: User = {
      id: 'mock-user-id',
      email: validatedData.email,
      name: validatedData.name,
      password_hash: await hashPassword(validatedData.password), // This would be the hashed password
      software_background: validatedData.software_background,
      hardware_background: validatedData.hardware_background,
      learning_goal: validatedData.learning_goal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    const mockSession = {
      token: 'mock-jwt-token-string',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    };

    return c.json({
      user: mockUser,
      session: mockSession
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed', details: (error as Error).message }, 500);
  }
});

// Login endpoint
app.post('/login', validateLogin, async (c) => {
  try {
    const validatedData = c.get('validatedData');

    // In a real implementation, you would:
    // 1. Find user by email
    // 2. Verify password
    // 3. Generate JWT token

    // For now, we'll return a mock response
    const mockUser: User = {
      id: 'mock-user-id',
      email: validatedData.email,
      name: 'Mock User',
      password_hash: await hashPassword(validatedData.password),
      software_background: 'Intermediate',
      hardware_background: 'Arduino',
      learning_goal: 'Learning robotics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    const mockSession = {
      token: 'mock-jwt-token-string',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return c.json({
      user: mockUser,
      session: mockSession
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed', details: (error as Error).message }, 500);
  }
});

// Get current user endpoint
app.get('/me', requireAuth, async (c) => {
  try {
    // In a real implementation, you would get the user ID from the token
    // and fetch the user from the database

    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Mock User',
      password_hash: 'hashed-password',
      software_background: 'Intermediate',
      hardware_background: 'Arduino',
      learning_goal: 'Learning robotics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    return c.json({ user: mockUser });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user', details: (error as Error).message }, 500);
  }
});

// Update user profile endpoint
app.put('/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId'); // This would come from the token in a real implementation
    const body = await c.req.json();

    // In a real implementation, you would update the user in the database
    // For now, we'll return a mock updated user

    const mockUser: User = {
      id: userId,
      email: 'user@example.com',
      name: 'Mock User',
      password_hash: 'hashed-password',
      software_background: body.software_background || 'Intermediate',
      hardware_background: body.hardware_background || 'Arduino',
      learning_goal: body.learning_goal || 'Learning robotics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    return c.json({ user: mockUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile', details: (error as Error).message }, 500);
  }
});

// Logout endpoint
app.post('/logout', requireAuth, async (c) => {
  try {
    // In a real implementation, you would invalidate the token
    // This could involve adding the token to a blacklist or deleting the session

    return c.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed', details: (error as Error).message }, 500);
  }
});

export default app;