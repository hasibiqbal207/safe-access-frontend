import jwt from "jsonwebtoken";
import logger from "../configs/logger.config.js";

/**
 * Signs a payload with a JWT token using the provided secret and expiration time.
 *
 * @param {Object} payload - The payload to be encoded in the token.
 * @param {string} expiresIn - The expiration time of the token.
 * @param {string} secret - The secret key used to sign the token.
 * @return {Promise<string>} A promise that resolves to the signed token.
 */
export const sign = async (payload, expiresIn, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: expiresIn,
      },
      (error, token) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};

/**
 * Verifies a JWT token using the provided secret.
 *
 * @param {string} token - The JWT token to be verified.
 * @param {string} secret - The secret used to verify the token.
 * @return {Promise<object|null>} A promise that resolves to the decoded 
 * payload of the token if it is valid, or null if it is not.
 */
export const verify = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};