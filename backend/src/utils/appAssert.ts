import AppError from '../interfaces/AppError.js';

/**
 * Assert a condition and throw an AppError if it fails
 * 
 * @param condition The condition to assert
 * @param statusCode HTTP status code to use if the assertion fails
 * @param message Error message to use if the assertion fails
 * @param code Optional error code for more specific error handling
 */
const appAssert = (
  condition: any,
  statusCode: number,
  message: string,
  code?: string
): asserts condition => {
  if (!condition) {
    throw new AppError(message, statusCode, code);
  }
};

export default appAssert; 