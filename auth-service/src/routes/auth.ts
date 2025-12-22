import { Hono } from 'hono';
import { hashPassword, verifyPassword } from '../utils/password';
import { validateRegistration, validateLogin, requireAuth } from '../middleware/validation';
import { User } from '../models/user';
import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize SQLite database
const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace('sqlite:///', '')
  : join(process.cwd(), 'local_chat.db');

const db = new Database(dbPath);

// Create tables if they don't exist - using the existing schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    software_background TEXT DEFAULT 'Beginner',
    hardware_background TEXT DEFAULT 'None',
    learning_goal TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    last_accessed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

const app = new Hono<{ Variables: import('../index').Variables }>();

// Registration endpoint
app.post('/register', validateRegistration, async (c) => {
  try {
    const validatedData = c.get('validatedData') as import('../models/user').RegistrationData;

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(validatedData.email) as User | undefined;
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Hash the password
    const password_hash = await hashPassword(validatedData.password);

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert new user into database
    const result = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, software_background, hardware_background, learning_goal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      validatedData.email,
      validatedData.name,
      password_hash,
      validatedData.software_background,
      validatedData.hardware_background,
      validatedData.learning_goal || null
    );

    // Create a mock session token (in a real app, you'd generate a proper JWT)
    const token = `mock-jwt-${userId}-${Date.now()}`;
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // Insert session into database - generate unique session ID
    const sessionId = `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    db.prepare(`
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(sessionId, userId, token, expires_at);

    // Return the created user and session
    const user: User = {
      id: userId,
      email: validatedData.email,
      name: validatedData.name,
      password_hash,
      software_background: validatedData.software_background,
      hardware_background: validatedData.hardware_background,
      learning_goal: validatedData.learning_goal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    const session = {
      token,
      expires_at
    };

    return c.json({
      user,
      session
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed', details: (error as Error).message }, 500);
  }
});

// Login endpoint
app.post('/login', validateLogin, async (c) => {
  try {
    const validatedData = c.get('validatedData') as import('../models/user').LoginData;

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(validatedData.email) as User | undefined;

    // If user doesn't exist, return error (this fixes the issue of logging in without registering)
    if (!user) {
      return c.json({ error: 'Invalid email or password. Account does not exist.' }, 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Create a mock session token (in a real app, you'd generate a proper JWT)
    const token = `mock-jwt-${user.id}-${Date.now()}`;
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // Insert session into database - generate unique session ID
    const sessionId = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    db.prepare(`
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(sessionId, user.id, token, expires_at);

    // Return user and session
    const session = {
      token,
      expires_at
    };

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        software_background: user.software_background,
        hardware_background: user.hardware_background,
        learning_goal: user.learning_goal,
        created_at: user.created_at,
        updated_at: user.updated_at,
        is_active: user.is_active
      },
      session
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed', details: (error as Error).message }, 500);
  }
});

// Get current user endpoint
app.get('/me', requireAuth, async (c) => {
  try {
    const userId = c.get('userId') as string;

    // Fetch user from database
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        software_background: user.software_background,
        hardware_background: user.hardware_background,
        learning_goal: user.learning_goal,
        created_at: user.created_at,
        updated_at: user.updated_at,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user', details: (error as Error).message }, 500);
  }
});

// Update user profile endpoint
app.put('/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId') as string;
    const body = await c.req.json();

    // Update user in database
    const stmt = db.prepare(`
      UPDATE users
      SET
        software_background = COALESCE(?, software_background),
        hardware_background = COALESCE(?, hardware_background),
        learning_goal = ?
      WHERE id = ?
    `);

    stmt.run(
      body.software_background || null,
      body.hardware_background || null,
      body.learning_goal || null,
      userId
    );

    // Fetch updated user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        software_background: user.software_background,
        hardware_background: user.hardware_background,
        learning_goal: user.learning_goal,
        created_at: user.created_at,
        updated_at: user.updated_at,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile', details: (error as Error).message }, 500);
  }
});

// Logout endpoint
app.post('/logout', requireAuth, async (c) => {
  try {
    const userId = c.get('userId') as string;

    // In a real implementation, you would invalidate the token
    // Delete the session from the database
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(userId);

    return c.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed', details: (error as Error).message }, 500);
  }
});

export default app;