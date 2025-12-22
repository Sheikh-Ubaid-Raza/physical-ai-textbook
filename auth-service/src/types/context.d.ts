import { RegistrationData, LoginData, UpdateProfileData } from '../models/user';

// Define the custom context variables interface
declare module 'hono' {
  interface ContextVariableMap {
    validatedData: RegistrationData | LoginData | UpdateProfileData;
    userId: string;
  }
}