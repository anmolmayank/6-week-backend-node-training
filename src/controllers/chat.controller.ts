
/**
 * Chat Controller
 *
 * Responsibilities:
 * - Handle incoming chat HTTP requests.
 * - Read the request body after validation middleware has run.
 * - Delegate chat generation to the service layer.
 * - Return a standardized API response.
 */

import type { Request, Response } from "express";

import { generateChatResponse } from "../services/chat.service.js";
import { ok } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

import type {
    ChatRequestInput,
} from "../validations/chat.validation.js";

/**
 * POST /api/v1/chat
 *
 * Generates a response using the locally configured AI model.
 */
export const chat = catchAsync(
    async (req: Request, res: Response) => {
        // Validation middleware populates req.validated.body.
        const payload = req.validated?.body as ChatRequestInput;

        // Forward the validated request to the chat service.
        const result = await generateChatResponse(payload);

        // Keep the API response consistent with other Node.js endpoints.
        return ok(
            res,
            result,
            "Chat response generated successfully",
        );
    },
);
