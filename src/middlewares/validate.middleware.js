import ApiError from "../utils/ApiError.js";
import httpStatus from "../constants/httpStatus.js";

const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "Name is required"));
  }

  if (!email) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "Email is required"));
  }

  next();
};

export default validateUser;
