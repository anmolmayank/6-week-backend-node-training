import ApiError from "../utils/ApiError.js";
import httpStatus from "../constants/httpStatus.js";

const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(
      httpStatus.NOT_FOUND,
      `Route '${req.method} ${req.originalUrl}' not found`,
    ),
  );
};

export default notFoundHandler;
