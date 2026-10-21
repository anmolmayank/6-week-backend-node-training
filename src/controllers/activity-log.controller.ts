
/**
 * ============================================================================
 * File: activity-log.controller.ts
 * Layer: Controller
 * ============================================================================
 *
 * Purpose
 * -------
 * Handles Activity Log HTTP requests and delegates operations to the service.
 *
 * ============================================================================
 */

import type { Request, Response } from "express";

import {
    createActivityLog as createActivityLogService,
    getActivityLogById,
    getActivityLogs as getActivityLogsService,
} from "../services/activity-log.service.js";

import {
    created,
    ok,
} from "../utils/ApiResponse.js";

import catchAsync from "../utils/catchAsync.js";

import type {
    ActivityLogIdParams,
    CreateActivityLogInput,
    GetActivityLogsQuery,
} from "../validations/activity-log.validation.js";

/**
 * POST /api/v1/activity-logs
 *
 * Creates an Activity Log.
 */
export const createActivityLog = catchAsync(
    async (req: Request, res: Response) => {
        const payload =
            req.validated?.body as CreateActivityLogInput;

        const activityLog =
            await createActivityLogService(payload);

        return created(
            res,
            activityLog,
            "Activity log created successfully",
        );
    },
);

/**
 * GET /api/v1/activity-logs
 *
 * Retrieves Activity Logs with pagination.
 */
export const getActivityLogs = catchAsync(
    async (req: Request, res: Response) => {
        const query =
            req.validated?.query as GetActivityLogsQuery;

        const activityLogs = await getActivityLogsService(
            query.skip,
            query.limit,
        );

        return ok(
            res,
            activityLogs,
            "Activity logs fetched successfully",
        );
    },
);

/**
 * GET /api/v1/activity-logs/:activityId
 *
 * Retrieves an Activity Log by ID.
 */
export const getActivityLog = catchAsync(
    async (req: Request, res: Response) => {
        const params = req.validated?.params as ActivityLogIdParams;

        const activityLog = await getActivityLogById(
            params.activityId,
        );

        return ok(
            res,
            activityLog,
            "Activity log fetched successfully",
        );
    },
);