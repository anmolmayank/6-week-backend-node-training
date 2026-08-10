import { z } from "zod";

/**
 * ------------------------------------------------------------------
 * MongoDB ObjectId Validation
 * ------------------------------------------------------------------
 *
 * Reusable schema for validating MongoDB ObjectIds.
 *
 * Example:
 * 689d58b7d6ef8d8c0b7d1234
 * ------------------------------------------------------------------
 */
export const objectIdSchema = z
    .string()
    .regex(
        /^[a-f\d]{24}$/i,
        "Invalid MongoDB ObjectId.",
    );

/**
 * ------------------------------------------------------------------
 * Pagination Validation
 * ------------------------------------------------------------------
 *
 * Validates query parameters used for paginated endpoints.
 *
 * Example:
 * GET /users?page=1&limit=10&sortBy=name&order=asc
 * ------------------------------------------------------------------
 */
export const paginationSchema = z.object({
    query: z.object({
        page: z.coerce
            .number()
            .int()
            .positive()
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(10),

        sortBy: z
            .enum([
                "name",
                "email",
                "createdAt",
            ])
            .default("createdAt"),

        order: z
            .enum([
                "asc",
                "desc",
            ])
            .default("desc"),
    }),
});

/**
 * ------------------------------------------------------------------
 * Type Inference
 * ------------------------------------------------------------------
 */

export type ObjectId =
    z.infer<
        typeof objectIdSchema
    >;

export type PaginationSchema =
    z.infer<
        typeof paginationSchema
    >;