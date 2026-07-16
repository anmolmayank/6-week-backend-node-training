import { error } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  error(res, err.message, err.status || 500);
};

export default errorHandler;
