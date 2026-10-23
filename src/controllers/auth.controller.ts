import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

/** POST /api/v1/auth/login */
export const login = catchAsync(async (req: Request, res: Response) => {
    const { body } = req.validated;
    const result = await authService.login(body as { email: string; password: string });
    return ApiResponse.ok(res, result, "Login successful.");
});

/** GET /api/v1/auth/me — returns the persisted identity represented by the token. */
export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication is required.");
    }

    return ApiResponse.ok(res, {
        _id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        tenantId: req.user.tenantId ? req.user.tenantId.toString() : null,
    }, "Current user fetched successfully.");
});
