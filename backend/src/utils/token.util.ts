import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Use a secure key in production
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key'; // Use a secure key in production

export const generateAccessToken = (userId: any): string => {
  return jwt.sign({ userId, type: "access" }, SECRET_KEY, { expiresIn: '1d' }); // Access token valid for 15 minutes
};

export const generateRefreshToken = (userId: any): string => {
  // Ensure userId is directly used, not as an object
  const userIdValue = typeof userId === 'object' && userId !== null && 'userId' in userId 
    ? userId.userId 
    : userId;
    
  return jwt.sign({ userId: userIdValue, type: "refresh" }, REFRESH_SECRET_KEY, { expiresIn: '7d' }); // Refresh token valid for 7 days
};
