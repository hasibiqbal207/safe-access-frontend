import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const PORT = parseInt(getEnv('PORT', '3000'), 10);
export const MONGODB_URI = getEnv('MONGODB_URL');
export const JWT_SECRET = getEnv('JWT_SECRET');
export const JWT_EXPIRES_IN = getEnv('JWT_EXPIRES_IN', '15m');
export const JWT_REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET');
export const JWT_REFRESH_EXPIRES_IN = getEnv('JWT_REFRESH_EXPIRES_IN', '7d');
export const CORS_ORIGIN = getEnv('CORS_ORIGIN', '*'); 