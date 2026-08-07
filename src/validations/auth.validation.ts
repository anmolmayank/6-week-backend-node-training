import { z } from "zod";

/**
 * ------------------------------------------------------------------
 * Login Request Body
 * ------------------------------------------------------------------
 *
 * Validates the payload sent during user login.
 *
 * Expected Request:
 *
 * {
 *   "email": "john@example.com",
 *   "password": "Password@123"
 * }
 * ------------------------------------------------------------------
 */
const loginBodySchema = z.object({
    /**
     * Registered email address.
     */
    email: z
        .email("Invalid email address.")
        .transform((email) =>
            email.trim().toLowerCase(),
        ),

    /**
     * User password.
     *
     * We only validate its presence here.
     * Password correctness is verified in the
     * Service layer using bcrypt.compare().
     */
    password: z
        .string()
        .min(1, "Password is required."),
});

/**
 * ------------------------------------------------------------------
 * Login Validation Schema
 * ------------------------------------------------------------------
 */
export const loginSchema = z.object({
    body: loginBodySchema,
});

/**
 * ------------------------------------------------------------------
 * Type Inference
 * ------------------------------------------------------------------
 *
 * Provides a TypeScript type inferred directly from the
 * Zod schema, ensuring runtime validation and compile-time
 * types stay in sync.
 * ------------------------------------------------------------------
 */
export type LoginSchema = z.infer<
    typeof loginSchema
>;