import crypto from 'crypto';
import axios from 'axios';
import logger from '../../config/logger.config.js';

export const isPasswordBreached = async (password: string): Promise<boolean> => {
  try {
    // Generate SHA-1 hash of the password
    const sha1Hash = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();
    
    // Get first 5 characters of hash for k-anonymity
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);

    // Query the HaveIBeenPwned API
    const response = await axios.get(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          'User-Agent': 'YourApp/1.0',
        },
      }
    );

    // Check if the remainder of hash exists in the response
    const hashes = response.data.split('\n');
    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':');
      if (hashSuffix.trim() === suffix) {
        logger.warn(`Password found in ${count.trim()} breaches`);
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Error checking password breach:', error);
    // In case of API failure, err on the side of caution
    return true;
  }
}; 