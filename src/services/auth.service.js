import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";

import { httpStatus } from "../constants/httpStatus.js";

import * as userRepository from "../repositories/user.repository.js";

/**
 * ------------------------------------------------------------------
 * Login User
 * ------------------------------------------------------------------
 *
 * Business Rules:
 * - User must exist.
 * - Password must match.
 * - Generate JWT on successful authentication.
 * - Never expose the password.
 * ------------------------------------------------------------------
 */
export const login = async (loginData) => {
  /**
   * ------------------------------------------------------------
   * Find user by email.
   * ------------------------------------------------------------
   *
   * Password is explicitly included by the repository because
   * the User model has `select: false` for the password field.
   */
  const user =
    await userRepository.findByEmailWithPassword(
      loginData.email
    );

  /**
   * ------------------------------------------------------------
   * Invalid email.
   * ------------------------------------------------------------
   */
  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password."
    );
  }

  /**
   * ------------------------------------------------------------
   * Verify password.
   * ------------------------------------------------------------
   */
  const isPasswordValid =
    await bcrypt.compare(
      loginData.password,
      user.password
    );

  /**
   * ------------------------------------------------------------
   * Invalid password.
   * ------------------------------------------------------------
   */
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password."
    );
  }

  /**
   * ------------------------------------------------------------
   * Remove password before returning the user.
   * ------------------------------------------------------------
   */
  const { password, ...authenticatedUser } = user;

  /**
   * ------------------------------------------------------------
   * Generate JWT.
   * ------------------------------------------------------------
   */
  const accessToken = generateAccessToken(
    authenticatedUser._id.toString()
  );

  /**
   * ------------------------------------------------------------
   * Return authenticated user and access token.
   * ------------------------------------------------------------
   */
  return {
    user: authenticatedUser,
    accessToken,
  };
};