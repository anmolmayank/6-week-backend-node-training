
/**
 * Activity Log Validation
 *
 * Validates:
 * - Activity Log creation payload.
 * - Activity Log pagination query parameters.
 */

import { z } from "zod";

/**
 * Schema for creating an Activity Log.
 */
export const createActivityLogSchema = z.object({
    body: z.object({
        user_id: z.string()
            .trim()
            .min(1, "User ID is required")
            .max(100, "User ID must not exceed 100 characters"),

        action: z.string()
            .trim()
            .min(1, "Action is required")
            .max(100, "Action must not exceed 100 characters"),

        description: z.string()
            .trim()
            .min(1, "Description is required")
            .max(500, "Description must not exceed 500 characters"),
    }),
});

/**
 * Schema for Activity Log pagination.
 *
 * Query parameters arrive as strings, so coerce them to numbers.
 */
export const getActivityLogsSchema = z.object({
    query: z.object({
        skip: z.coerce.number()
            .int("Skip must be an integer")
            .min(0, "Skip cannot be negative")
            .default(0),

        limit: z.coerce.number()
            .int("Limit must be an integer")
            .min(1, "Limit must be at least 1")
            .max(100, "Limit cannot exceed 100")
            .default(20),
    }),
});

/**
 * Schema for retrieving an Activity Log by ID.
 */
export const activityLogIdSchema = z.object({
    params: z.object({
        activityId: z.string()
            .trim()
            .min(1, "Activity ID is required"),
    }),
});

/**
 * Inferred TypeScript types.
 */
export type CreateActivityLogInput = z.infer<
    typeof createActivityLogSchema
>["body"];

export type GetActivityLogsQuery = z.infer<
    typeof getActivityLogsSchema
>["query"];

export type ActivityLogIdParams = z.infer<
    typeof activityLogIdSchema
>["params"];
