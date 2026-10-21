
/**
 * Activity Log Service
 *
 * Responsibilities:
 * - Create activity logs through FastAPI.
 * - Retrieve activity logs with pagination.
 * - Retrieve an activity log by ID.
 *
 * MongoDB access remains inside FastAPI.
 */

import { fastApiRequest } from "../clients/fastapi.client.js";

import type {
    ActivityLogResponse,
    CreateActivityLogRequest,
} from "../types/activity-log.types.js";

/**
 * FastAPI endpoint for Activity Log operations.
 */
const ACTIVITY_LOGS_PATH = "api/v1/activity-logs";

/**
 * Create an activity log.
 */
export async function createActivityLog(
    payload: CreateActivityLogRequest,
): Promise<ActivityLogResponse> {
    return fastApiRequest<ActivityLogResponse>(
        ACTIVITY_LOGS_PATH,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );
}

/**
 * Retrieve activity logs with pagination.
 */
export async function getActivityLogs(
    skip = 0,
    limit = 20,
): Promise<ActivityLogResponse[]> {
    const query = new URLSearchParams({
        skip: String(skip),
        limit: String(limit),
    });

    return fastApiRequest<ActivityLogResponse[]>(
        `${ACTIVITY_LOGS_PATH}?${query.toString()}`,
        {
            method: "GET",
        },
    );
}

/**
 * Retrieve a single activity log by ID.
 */
export async function getActivityLogById(
    activityId: string,
): Promise<ActivityLogResponse> {
    const encodedId = encodeURIComponent(activityId);

    return fastApiRequest<ActivityLogResponse>(
        `${ACTIVITY_LOGS_PATH}/${encodedId}`,
        {
            method: "GET",
        },
    );
}
