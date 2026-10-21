
/**
 * Chat Service
 *
 * Responsibilities:
 * - Forward validated chat requests to FastAPI.
 * - Allow sufficient time for local LLM inference.
 * - Keep inter-service communication separate from controller logic.
 *
 * The FastAPI service is responsible for communicating with Ollama
 * and selecting the configured model.
 */

import { fastApiRequest } from "../clients/fastapi.client.js";

import type {
    ChatRequest,
    ChatServiceResponse,
} from "../types/chat.types.js";

/** FastAPI endpoint for generating chat responses. */
const CHAT_PATH = "api/v1/chat";

/** Maximum time allowed for local model inference: 120 seconds. */
const CHAT_TIMEOUT_MS = 120_000;

/**
 * Generate a response through the FastAPI chat endpoint.
 *
 * @param request - The validated user message.
 * @returns The generated message and inference provider.
 */
export async function generateChatResponse(
    request: ChatRequest,
): Promise<ChatServiceResponse> {
    return fastApiRequest<ChatServiceResponse>(
        CHAT_PATH,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        },
        CHAT_TIMEOUT_MS,
    );
}
