import { z, ZodError } from 'zod';
import { Context } from 'hono';
import { RegistrationDataSchema, LoginDataSchema, UpdateProfileSchema } from '../models/user';

export const validateRegistration = async (c: Context, next: () => Promise<void>) => {
  try {
    const body = await c.req.json();
    const validatedData = RegistrationDataSchema.parse(body);
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
    const validatedData = LoginDataSchema.parse(body);
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
    const validatedData = UpdateProfileSchema.parse(body);
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

  // In a real implementation, you would verify the JWT token here
  // For now, we'll just check if it exists
  if (!token) {
    return c.json({ error: 'Valid token required' }, 401);
  }

  // In a real implementation, you would decode the token and attach user info to context
  c.set('userId', 'dummy-user-id'); // Placeholder - in real app, this would come from token
  await next();
};