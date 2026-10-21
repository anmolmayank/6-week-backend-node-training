
/**
 * Activity Log Types
 *
 * These interfaces describe the contract between
 * Node.js and the FastAPI Activity Log endpoints.
 */

/**
 * Payload required to create an activity log.
 */
export interface CreateActivityLogRequest {
    user_id: string;
    action: string;
    description: string;
}

/**
 * Activity Log returned by FastAPI.
 */
export interface ActivityLogResponse {
    id: string;
    user_id: string;
    action: string;
    description: string;
    created_at: string;
}

/**
 * Paginated Activity Log list response.
 */
export interface ActivityLogListResponse {
    items: ActivityLogResponse[];
    total?: number;
}
