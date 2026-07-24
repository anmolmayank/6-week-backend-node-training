import express from "express";

import * as authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

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
  authController.login
);

export default router;