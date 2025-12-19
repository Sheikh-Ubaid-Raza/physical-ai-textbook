import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  // In a real implementation, you would use a proper salt rounds value
  const saltRounds = 12;
  return await hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await compare(password, hash);
};