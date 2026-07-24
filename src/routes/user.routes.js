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
 * Register a new user.
 */
router.post(
  "/",
  validate(createUserSchema),
  userController.createUser
);

/**
 * ------------------------------------------------------------------
 * Protected Routes
 * ------------------------------------------------------------------
 */

/**
 * Get authenticated user's profile.
 */
router.get(
  "/:id",
  authenticate,
  validate(getUserSchema),
  authorizeOwner,
  userController.getUserById
);

/**
 * Update authenticated user's profile.
 */
router.patch(
  "/:id",
  authenticate,
  validate(updateUserSchema),
  authorizeOwner,
  userController.updateUser
);

/**
 * Delete authenticated user's account.
 */
router.delete(
  "/:id",
  authenticate,
  validate(deleteUserSchema),
  authorizeOwner,
  userController.deleteUser
);


export default router;