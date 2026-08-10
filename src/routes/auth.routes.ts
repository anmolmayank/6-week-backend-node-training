import express from "express";

import * as authController from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";


const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login User
 *     description: Authenticates a user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * ------------------------------------------------------------------
 * POST /auth/login
 * ------------------------------------------------------------------
 *
 * Authenticates a registered user.
 * ------------------------------------------------------------------
 */
router.post(
    "/login",
    validate(loginSchema),
    authController.login,
);

export default router;