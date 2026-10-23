import { z } from "zod";

import { objectIdSchema } from "./common.validation.js";

/**
 * ------------------------------------------------------------------
 * Create User Body Schema
 * ------------------------------------------------------------------
 *
 * Used only while creating a new user.
 *
 * Password is required.
 * ------------------------------------------------------------------
 */
const createUserBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .email("Invalid email address.")
        .transform((email) =>
            email.trim().toLowerCase(),
        ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100, "Password cannot exceed 100 characters."),
});

/**
 * ------------------------------------------------------------------
 * Update User Body Schema
 * ------------------------------------------------------------------
 *
 * Password updates are intentionally excluded.
 *
 * Password changes should happen through a dedicated
 * Change Password / Reset Password API.
 * ------------------------------------------------------------------
 */
const updateUserBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    email: z
        .email("Invalid email address.")
        .transform((email) =>
            email.trim().toLowerCase(),
        )
        .optional(),

    /** Owner-managed role assignment; public registration cannot set this. */
    role: z.enum(["owner", "tenant"]).optional(),

    /** Link a tenant account to a tenant record, or null to unlink it. */
    tenantId: objectIdSchema.nullable().optional(),
});

/**
 * ------------------------------------------------------------------
 * Create User Validation
 * ------------------------------------------------------------------
 */
export const createUserSchema = z.object({
    body: createUserBodySchema,
});

/**
 * ------------------------------------------------------------------
 * Update User Validation
 * ------------------------------------------------------------------
 */
export const updateUserSchema = z
    .object({
        params: z.object({
            id: objectIdSchema,
        }),

        body: updateUserBodySchema,
    })
    .refine(
        ({ body }) => Object.keys(body).length > 0,
        {
            message: "At least one field must be provided for update.",
            path: ["body"],
        },
    )
    .refine(
        ({ body }) => !(body.role === "owner" && body.tenantId),
        {
            message: "An owner account cannot be linked to a tenant record.",
            path: ["body", "tenantId"],
        },
    );

/**
 * ------------------------------------------------------------------
 * Delete User Validation
 * ------------------------------------------------------------------
 */
export const deleteUserSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

/**
 * ------------------------------------------------------------------
 * Get User Validation
 * ------------------------------------------------------------------
 */
export const getUserSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

/**
 * ------------------------------------------------------------------
 * Type Inference
 * ------------------------------------------------------------------
 */

export type CreateUserSchema = z.infer<
    typeof createUserSchema
>;

export type UpdateUserSchema = z.infer<
    typeof updateUserSchema
>;

export type DeleteUserSchema = z.infer<
    typeof deleteUserSchema
>;

export type GetUserSchema = z.infer<
    typeof getUserSchema
>;