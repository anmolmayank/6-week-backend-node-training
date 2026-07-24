import { httpStatus } from "../constants/httpStatus.js";

/**
 * ------------------------------------------------------------------
 * Global Error Handler
 * ------------------------------------------------------------------
 *
 * Centralized error handling middleware.
 *
 * Handles:
 * - Validation errors
 * - Business errors
 * - Database errors
 * - Unexpected server errors
 * ------------------------------------------------------------------
 */
const errorHandler = (error, req, res, next) => {
  const statusCode =
    error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors ?? [],
  });
};

export default errorHandler;