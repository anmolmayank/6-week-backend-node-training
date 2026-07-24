import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * ------------------------------------------------------------------
 * Generate Access Token
 * ------------------------------------------------------------------
 *
 * Creates a signed JWT containing the authenticated user's id.
 * ------------------------------------------------------------------
 */
export const generateAccessToken = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );

  /**
   * ------------------------------------------------------------
   * Development Log
   * ------------------------------------------------------------
   */
  console.log("\n================ JWT Generated ================");
  console.log(token);
  console.log("==============================================\n");

  return token;
};

/**
 * ------------------------------------------------------------------
 * Verify Access Token
 * ------------------------------------------------------------------
 *
 * Validates the JWT signature and expiration.
 * Returns the decoded payload.
 * ------------------------------------------------------------------
 */
export const verifyAccessToken = (token) => {
  const decodedToken = jwt.verify(token, env.jwtSecret);

  /**
   * ------------------------------------------------------------
   * Development Log
   * ------------------------------------------------------------
   */
  console.log("\n============= JWT Decoded Payload =============");
  console.log(decodedToken);
  console.log("===============================================\n");

  return decodedToken;
};
