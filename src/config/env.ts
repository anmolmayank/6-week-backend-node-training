/**
 * ============================================================================
 * File: env.ts
 * Layer: Configuration
 * ============================================================================
 *
 * Purpose
 * -------
 * Loads and validates environment variables required by the application.
 *
 * Responsibilities
 * ----------------
 * - Load variables from the .env file.
 * - Validate the presence of required environment variables.
 * - Convert environment variables to their appropriate types.
 * - Export a centralized configuration object.
 *
 * Notes
 * -----
 * Environment variables are validated during application startup.
 * The application fails fast if any required configuration is missing,
 * preventing runtime failures caused by invalid configuration.
 *
 * ============================================================================
 */

import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

/**
 * ============================================================================
 * Required Environment Variables
 * ============================================================================
 *
 * These variables must be defined before the application starts.
 * Missing variables will cause the application to terminate during
 * startup.
 */
const requiredEnvVariables = [
    "PORT",
    "CLIENT_URL",
    "NODE_ENV",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_CLUSTER",
    "DB_NAME",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
] as const;

/**
 * ============================================================================
 * Validate Required Environment Variables
 * ============================================================================
 *
 * Ensures every required environment variable exists.
 */
requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(
            `Missing required environment variable: ${key}`,
        );
    }
});

/**
 * ============================================================================
 * Application Configuration
 * ============================================================================
 *
 * Centralized configuration used throughout the application.
 *
 * Notes
 * -----
 * Since all required variables have already been validated above,
 * the non-null assertion operator (!) is safe to use.
 */
export const env = {
    /**
     * Application Port
     */
    port: Number(process.env.PORT),

    /**
     * Allowed Frontend Origin
     */
    clientUrl: process.env.CLIENT_URL!,

    /**
     * Current Runtime Environment
     */
    nodeEnv: process.env.NODE_ENV!,

    /**
     * MongoDB Credentials
     */
    dbUsername: process.env.DB_USERNAME!,

    dbPassword: process.env.DB_PASSWORD!,

    dbCluster: process.env.DB_CLUSTER!,

    dbName: process.env.DB_NAME!,

    /**
     * JWT Secret Key
     */
    jwtSecret: process.env.JWT_SECRET!,

    /**
     * JWT Expiration Duration
     *
     * Examples:
     * - 15m
     * - 1h
     * - 7d
     */
    jwtExpiresIn:
        process.env.JWT_EXPIRES_IN! as SignOptions["expiresIn"],
} as const;

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. dotenv loads environment variables from the .env file into process.env.
 *
 * 2. Validating configuration during startup follows the Fail Fast principle,
 *    allowing configuration issues to be detected before serving requests.
 *
 * 3. The non-null assertion operator (!) is safe here because every required
 *    environment variable has already been validated.
 *
 * 4. The exported env object provides a single source of truth for application
 *    configuration, avoiding direct access to process.env throughout the codebase.
 *
 * 5. Using "as const" makes the exported configuration object immutable and
 *    improves TypeScript's type inference.
 *
 * ============================================================================
 */