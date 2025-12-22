import { z } from 'zod';

// Define the User schema with background fields
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password_hash: z.string(),
  software_background: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  hardware_background: z.enum(['None', 'Arduino', 'RaspberryPi']),
  learning_goal: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_active: z.boolean().default(true),
});

export type User = z.infer<typeof UserSchema>;

// Define the registration data schema
export const RegistrationDataSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8, 'Password must be at least 8 characters long'), // At least 8 characters
  software_background: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  hardware_background: z.enum(['None', 'Arduino', 'RaspberryPi']),
  learning_goal: z.string().optional(),
});

export type RegistrationData = z.infer<typeof RegistrationDataSchema>;

// Define the login data schema
export const LoginDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginData = z.infer<typeof LoginDataSchema>;

// Define the update profile schema
export const UpdateProfileSchema = z.object({
  software_background: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  hardware_background: z.enum(['None', 'Arduino', 'RaspberryPi']).optional(),
  learning_goal: z.string().optional(),
});

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;