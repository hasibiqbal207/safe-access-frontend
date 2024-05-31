import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

/**
 * Finds a user by their ID.
 *
 * @param {string} userId - The ID of the user to find.
 * @return {Promise<Object>} The user object if found, otherwise throws a BadRequest error.
 */
export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest("Please fill all fields.");
  return user;
};

/**
 * Searches for users based on a keyword and excludes a specific user.
 *
 * @param {string} keyword - The keyword to search for in the user's name or email.
 * @param {string} userId - The ID of the user to exclude from the search results.
 * @return {Promise<Array>} An array of user objects that match the search criteria.
 */
export const searchUsers = async (keyword, userId) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ],
  }).find({
    _id: { $ne: userId },
  });
  return users;
};