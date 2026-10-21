/**
 * FastAPI HTTP Client
 *
 * Responsibilities:
 * - Communicate with the Python FastAPI service.
 * - Apply a timeout to outgoing requests.
 * - Handle unsuccessful HTTP responses.
 * - Keep FastAPI communication separate from business logic.
 */

import { env } from "../config/env.js";

/**
 * Makes a typed HTTP request to the FastAPI service.
 *
 * TResponse represents the expected response type.
 */
export async function fastApiRequest<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const fastApiBaseUrl = env.fastApiBaseUrl;

  if (!fastApiBaseUrl) {
    throw new Error("FASTAPI_BASE_URL is not configured.");
  }

  let baseUrl = fastApiBaseUrl;

  while (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const normalizedPath = path.replace(/^\/+/, "");

  const url = `${baseUrl}/${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`FastAPI request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}
