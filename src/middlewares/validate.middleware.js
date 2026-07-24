import { ZodError } from "zod";

import ApiError from "../utils/ApiError.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ------------------------------------------------------------------
 * Validation Middleware
 * ------------------------------------------------------------------
 *
 * Validates incoming request data using the supplied Zod schema.
 *
 * Instead of mutating req.body, req.params or req.query,
 * the validated data is attached to:
 *
 * req.validated = {
 *   body,
 *   params,
 *   query,
 * }
 *
 * This approach is fully compatible with Express 5 and keeps the
 * original request untouched.
 * ------------------------------------------------------------------
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      /**
       * Validate request.
       */
      const validatedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      /**
       * Store validated data.
       */
      req.validated = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return next(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "Validation failed.",
            formattedErrors
          )
        );
      }

      next(error);
    }
  };
};

export default validate;