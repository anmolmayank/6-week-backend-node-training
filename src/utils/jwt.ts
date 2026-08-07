/**
 * ============================================================================
 * File: jwt.ts
 * Layer: Utility
 * ============================================================================
 *
 * Purpose
 * -------
 * Generates and verifies JSON Web Tokens (JWTs).
 *
 * Responsibilities
 * ----------------
 * - Generate signed access tokens.
 * - Verify access tokens.
 * - Return typed JWT payloads.
 *
 * ============================================================================
 */

import jwt, {
    type JwtPayload,
    type SignOptions,
} from "jsonwebtoken";

import { env } from "../config/env.js";

/**
 * ============================================================================
 * JWT Payload
 * ============================================================================
 */
export interface AccessTokenPayload extends JwtPayload {
    userId: string;
}

/**
 * ============================================================================
 * Generate Access Token
 * ============================================================================
 */
export const generateAccessToken = (
    userId: string,
): string => {
    const payload: AccessTokenPayload = {
        userId,
    };

    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(
        payload,
        env.jwtSecret,
        options,
    );
};

/**
 * ============================================================================
 * Verify Access Token
 * ============================================================================
 */
export const verifyAccessToken = (
    token: string,
): AccessTokenPayload => {
    const decodedToken = jwt.verify(
        token,
        env.jwtSecret,
    );

    if (typeof decodedToken === "string") {
        throw new Error(
            "Invalid JWT payload.",
        );
    }

    return decodedToken as AccessTokenPayload;
};