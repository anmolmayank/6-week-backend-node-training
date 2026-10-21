
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateActivityLogRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - action
 *         - description
 *       properties:
 *         user_id:
 *           type: string
 *           maxLength: 100
 *           example: test-user-001
 *         action:
 *           type: string
 *           maxLength: 100
 *           example: LOGIN
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: User logged in successfully
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 68f4a1234567890123456789
 *         user_id:
 *           type: string
 *           example: test-user-001
 *         action:
 *           type: string
 *           example: LOGIN
 *         description:
 *           type: string
 *           example: User logged in successfully
 *         created_at:
 *           type: string
 *           format: date-time
 *     ActivityLogApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Activity log fetched successfully
 *         data:
 *           type: object
 *         meta:
 *           type: object
 *
 * /api/v1/activity-logs:
 *   post:
 *     tags:
 *       - Activity Logs
 *     summary: Create an activity log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityLogRequest'
 *     responses:
 *       '201':
 *         description: Activity log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityLogApiResponse'
 *       '400':
 *         description: Invalid request
 *
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get activity logs
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       '200':
 *         description: Activity logs retrieved successfully
 *       '400':
 *         description: Invalid pagination parameters
 *
 * /api/v1/activity-logs/{activityId}:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get an activity log by ID
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB activity log ID
 *     responses:
 *       '200':
 *         description: Activity log retrieved successfully
 *       '404':
 *         description: Activity log not found
 */

/**
 * ============================================================================
 * File: activity-log.routes.ts
 * Layer: Routes
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the Node.js API endpoints for Activity Logs.
 * Request validation runs before the controller.
 *
 * Endpoints
 * ---------
 * POST   /api/v1/activity-logs
 * GET    /api/v1/activity-logs
 * GET    /api/v1/activity-logs/:activityId
 *
 * ============================================================================
 */

import { Router } from "express";

import {
    createActivityLog,
    getActivityLog,
    getActivityLogs,
} from "../controllers/activity-log.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
    activityLogIdSchema,
    createActivityLogSchema,
    getActivityLogsSchema,
} from "../validations/activity-log.validation.js";

/**
 * Router for Activity Log endpoints.
 */
const router = Router();

/**
 * POST /api/v1/activity-logs
 *
 * Creates a new Activity Log.
 */
router.post(
    "/",
    validate(createActivityLogSchema),
    createActivityLog,
);

/**
 * GET /api/v1/activity-logs
 *
 * Retrieves Activity Logs with pagination.
 */
router.get(
    "/",
    validate(getActivityLogsSchema),
    getActivityLogs,
);

/**
 * GET /api/v1/activity-logs/:activityId
 *
 * Retrieves an Activity Log by its ID.
 */
router.get(
    "/:activityId",
    validate(activityLogIdSchema),
    getActivityLog,
);

export default router;
