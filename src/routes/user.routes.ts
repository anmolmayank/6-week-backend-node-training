import express from "express";

import * as userController from "../controllers/user.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeOwner from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
    deleteUserSchema,
} from "../validations/user.validation.js";

const router = express.Router();

/**
 * ------------------------------------------------------------------
 * Public Routes
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Register a user account
 *     description: Public registration always creates an unlinked tenant account. Role and tenantId values from the request are not accepted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 100, example: Tenant Name }
 *               email: { type: string, format: email, example: tenant@example.com }
 *               password: { type: string, minLength: 8, format: password }
 *     responses:
 *       "201": { description: Tenant account created with no tenant association yet. }
 *       "409": { description: Email already exists. }
 */
router.post(
    "/",
    validate(createUserSchema),
    userController.createUser,
);

/**
 * ------------------------------------------------------------------
 * Protected Routes
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List user accounts (owner only)
 *     description: Returns safe account metadata for owner management and linking tenant accounts.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200": { description: User accounts returned. }
 *       "403": { description: Owner access required. }
 */
router.get("/", authenticate, authorizeOwner, userController.getUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID (owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[a-fA-F0-9]{24}$' }
 *     responses:
 *       "200": { description: Safe user metadata returned. }
 *       "403": { description: Owner access required. }
 *       "404": { description: User not found. }
 */
router.get(
    "/:id",
    authenticate,
    validate(getUserSchema),
    authorizeOwner,
    userController.getUserById,
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user or link a tenant account (owner only)
 *     description: Owners can edit account details, assign role, and link a tenant user to one tenant record. Public registration cannot choose a role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[a-fA-F0-9]{24}$' }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 100 }
 *               email: { type: string, format: email }
 *               role: { type: string, enum: [owner, tenant] }
 *               tenantId: { type: string, nullable: true, description: Set to a tenant MongoDB ObjectId or null to unlink. }
 *     responses:
 *       "200": { description: User updated. }
 *       "400": { description: Validation failed or invalid role/tenant relationship. }
 *       "403": { description: Owner access required. }
 *       "404": { description: User or tenant not found. }
 *       "409": { description: Tenant already linked to another account. }
 */
router.patch(
    "/:id",
    authenticate,
    validate(updateUserSchema),
    authorizeOwner,
    userController.updateUser,
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user account (owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[a-fA-F0-9]{24}$' }
 *     responses:
 *       "200": { description: User account deleted. }
 *       "403": { description: Owner access required. }
 *       "404": { description: User not found. }
 */
router.delete(
    "/:id",
    authenticate,
    validate(deleteUserSchema),
    authorizeOwner,
    userController.deleteUser,
);

export default router;