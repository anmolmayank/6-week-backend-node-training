import type { Request, Response } from "express";

import * as userService from "../services/user.service.js";

import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ------------------------------------------------------------------
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Owner only
 * ------------------------------------------------------------------
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsers();

  return ApiResponse.ok(res, users, "Users fetched successfully.");
});

/**
 * ------------------------------------------------------------------
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Owner only
 * ------------------------------------------------------------------
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.validated.params as {
    id: string;
  };

  const user = await userService.getUserById(id);

  return ApiResponse.ok(res, user, "User fetched successfully.");
});

/**
 * ------------------------------------------------------------------
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 * ------------------------------------------------------------------
 *
 * Creates a new user using validated request data.
 * ------------------------------------------------------------------
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { body } = req.validated;

  const createdUser = await userService.createUser(
    body as {
      name: string;
      email: string;
      password: string;
    },
  );

  return ApiResponse.created(res, createdUser, "User created successfully.");
});

/**
 * ------------------------------------------------------------------
 * Update User
 * ------------------------------------------------------------------
 *
 * Owner-managed update of account details, role, and optional tenant link.
 *
 * Route:
 * PATCH /api/v1/users/:id
 * ------------------------------------------------------------------
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.validated.params as { id: string };
  const { body } = req.validated;

  const updatedUser = await userService.updateUser(
    id,
    body as {
      name?: string;
      email?: string;
      role?: "owner" | "tenant";
      tenantId?: string | null;
    },
  );

  return ApiResponse.success(
    res,
    httpStatus.OK,
    updatedUser,
    "User updated successfully.",
  );
});

/**
 * ------------------------------------------------------------------
 * Delete User
 * ------------------------------------------------------------------
 *
 * Owner-only deletion of a user account.
 *
 * Route:
 * DELETE /api/v1/users/:id
 * ------------------------------------------------------------------
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.validated.params as { id: string };

  await userService.deleteUser(id);

  return ApiResponse.success(
    res,
    httpStatus.OK,
    null,
    "User deleted successfully.",
  );
});
