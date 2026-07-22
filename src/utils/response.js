import httpStatus from "../constants/httpStatus.js";

const sendResponse = (res, { success, message, data = null, status }) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

export const ok = (res, data, message = "Success") =>
  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message,
    data,
  });

export const created = (res, data, message = "Created Successfully") =>
  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message,
    data,
  });

export const error = (
  res,
  message,
  status = httpStatus.INTERNAL_SERVER_ERROR,
) =>
  sendResponse(res, {
    success: false,
    status,
    message,
  });
