import { z, ZodError } from 'zod';
import { Context } from 'hono';
import { RegistrationDataSchema, LoginDataSchema, UpdateProfileSchema, RegistrationData, LoginData, UpdateProfileData } from '../models/user';
import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize SQLite database
const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace('sqlite:///', '')
  : join(process.cwd(), 'local_chat.db');

const db = new Database(dbPath);

export const validateRegistration = async (c: Context, next: () => Promise<void>) => {
  try {
    const body = await c.req.json();

    // Additional validation beyond Zod schema
    if (body.password && body.password.length < 8) {
      return c.json(
        {
          error: 'Validation error',
          details: [{
            field: 'password',
            message: 'Password must be at least 8 characters long'
          }]
        },
        400
      );
    }

    // Validate email format using regex (Zod email validation is already in schema)
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return c.json(
          {
            error: 'Validation error',
            details: [{
              field: 'email',
              message: 'Invalid email format'
            }]
          },
          400
        );
      }
    }

    const validatedData = RegistrationDataSchema.parse(body) as RegistrationData;
    c.set('validatedData', validatedData);
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        400
      );
    }
    return c.json({ error: 'Invalid request data' }, 400);
  }
};

export const validateLogin = async (c: Context, next: () => Promise<void>) => {
  try {
    const body = await c.req.json();

    // Additional validation beyond Zod schema
    if (body.password && body.password.length < 8) {
      return c.json(
        {
          error: 'Validation error',
          details: [{
            field: 'password',
            message: 'Password must be at least 8 characters long'
          }]
        },
        400
      );
    }

    // Validate email format using regex
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return c.json(
          {
            error: 'Validation error',
            details: [{
              field: 'email',
              message: 'Invalid email format'
            }]
          },
          400
        );
      }
    }

    const validatedData = LoginDataSchema.parse(body) as LoginData;
    c.set('validatedData', validatedData);
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        400
      );
    }
    return c.json({ error: 'Invalid request data' }, 400);
  }
};

export const validateUpdateProfile = async (c: Context, next: () => Promise<void>) => {
  try {
    const body = await c.req.json();
    const validatedData = UpdateProfileSchema.parse(body) as UpdateProfileData;
    c.set('validatedData', validatedData);
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        400
      );
    }
    return c.json({ error: 'Invalid request data' }, 400);
  }
};

// Middleware to check if user is authenticated
export const requireAuth = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization header required' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Check if the token exists in the user_sessions table
  const session = db.prepare('SELECT * FROM user_sessions WHERE token = ?').get(token) as {
    user_id: string;
    expires_at: string;
  } | undefined;

  if (!session) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Check if the session has expired
  const now = new Date();
  const expiresAt = new Date(session.expires_at);
  if (now > expiresAt) {
    // Delete the expired session
    db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
    return c.json({ error: 'Session has expired' }, 401);
  }

  // Attach the user ID to the context
  c.set('userId', session.user_id);
  await next();
};