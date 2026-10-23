
/**
 * FastAPI HTTP Client
 *
 * Responsibilities:
 * - Send HTTP requests to the Python FastAPI microservice.
 * - Apply a configurable timeout to outgoing requests.
 * - Handle unsuccessful HTTP responses.
 * - Keep inter-service HTTP communication separate from business logic.
 */

import { env } from "../config/env.js";

/**
 * Make a typed HTTP request to the FastAPI service.
 *
 * @typeParam TResponse - Expected response body type.
 * @param path - Endpoint path relative to the configured base URL.
 * @param options - Standard Fetch API request options.
 * @param timeoutMs - Request timeout in milliseconds; defaults to 10 seconds.
 * @returns The parsed JSON response.
 * @throws Error if the base URL is missing or the request fails.
 */
export async function fastApiRequest<TResponse>(
    path: string,
    options: RequestInit = {},
    timeoutMs = 10_000,
): Promise<TResponse> {
    const fastApiBaseUrl = env.fastApiBaseUrl;

    if (!fastApiBaseUrl) {
        throw new Error("FASTAPI_BASE_URL is not configured.");
    }

    // Normalize the URL to avoid duplicate or missing slashes.
    const baseUrl = fastApiBaseUrl.replace(/\/+$/, "");
    const normalizedPath = path.replace(/^\/+/, "");
    const url = `${baseUrl}/${normalizedPath}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...options.headers,
        },
        // Allow slower local LLM inference when callers request it.
        signal: AbortSignal.timeout(timeoutMs),
    });

    // Preserve the existing error-handling behavior for callers.
    if (!response.ok) {
        throw new Error(
            `FastAPI request failed with status ${response.status}.`,
        );
    }

    return (await response.json()) as TResponse;
}
