
/**
 * Chat Request Validation
 *
 * Responsibilities:
 * - Validate the incoming chat request body.
 * - Reject empty messages.
 * - Enforce the maximum message length expected by FastAPI.
 */

import { z } from "zod";

/**
 * Schema for POST /api/v1/chat.
 *
 * The outer body property follows the project's existing
 * request-validation middleware convention.
 */
export const chatRequestSchema = z.object({
    body: z.object({
        message: z.string()
            .trim()
            .min(1, "Message is required")
            .max(2000, "Message must not exceed 2000 characters"),
    }),
});

/**
 * Type inferred from the validated request body.
 */
export type ChatRequestInput = z.infer<
    typeof chatRequestSchema
>["body"];
