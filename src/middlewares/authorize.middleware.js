import ApiError from "../utils/ApiError.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ------------------------------------------------------------------
 * Authorization Middleware
 * ------------------------------------------------------------------
 *
 * Ensures users can only access their own resource.
 *
 * Requires:
 * - authenticate() to execute first.
 * - req.user
 * - req.params.id
 * ------------------------------------------------------------------
 */
const authorizeOwner = (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  if (_id.toString() !== id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to perform this action.",
    );
  }

  next();
};

export default authorizeOwner;
