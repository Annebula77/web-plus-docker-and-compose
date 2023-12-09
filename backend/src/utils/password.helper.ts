import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds = 12): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (enteredPassword: string, storedPassword: string): Promise<boolean> => {
  return bcrypt.compare(enteredPassword, storedPassword);
};