import { sign, verify } from "../utils/token.util.js";

/**
 * Wrapper function that generates a token using the provided payload, expiration time, and secret.
 *
 * @param {Object} payload - The payload to be encoded in the token.
 * @param {string} expiresIn - The expiration time of the token.
 * @param {string} secret - The secret key used to sign the token.
 * @return {Promise<string>} A promise that resolves to the generated token.
 */
export const generateToken = async (payload, expiresIn, secret) => {
  let token = await sign(payload, expiresIn, secret);
  return token;
};

/**
 * Wrapper function that verifies a token using the provided secret.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secret - The secret used to verify the token.
 * @return {Promise<object|null>} A promise that resolves to the decoded 
 * payload of the token if it is valid, or null if it is not.
 */
export const verifyToken = async (token, secret) => {
  let check = await verify(token, secret);
  return check;
};