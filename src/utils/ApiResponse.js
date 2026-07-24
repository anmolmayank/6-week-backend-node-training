import { httpStatus } from "../constants/httpStatus.js";

/**
 * ------------------------------------------------------------------
 * Standard API Success Response
 * ------------------------------------------------------------------
 */
export const success = (
  res,
  statusCode,
  data = null,
  message = "Success",
  meta = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

/**
 * ------------------------------------------------------------------
 * HTTP 200
 * ------------------------------------------------------------------
 */
export const ok = (
  res,
  data,
  message = "Success",
  meta = {}
) => {
  return success(
    res,
    httpStatus.OK,
    data,
    message,
    meta
  );
};

/**
 * ------------------------------------------------------------------
 * HTTP 201
 * ------------------------------------------------------------------
 */
export const created = (
  res,
  data,
  message = "Created successfully"
) => {
  return success(
    res,
    httpStatus.CREATED,
    data,
    message
  );
};

/**
 * ------------------------------------------------------------------
 * HTTP 204
 * ------------------------------------------------------------------
 */
export const noContent = (res) => {
  return res
    .status(httpStatus.NO_CONTENT)
    .send();
};