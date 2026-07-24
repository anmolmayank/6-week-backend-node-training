/**
 * ------------------------------------------------------------------
 * Wrap async controllers to automatically forward
 * rejected promises to Express error middleware.
 * ------------------------------------------------------------------
 */
const catchAsync = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next))
      .catch(next);
  };
};

export default catchAsync;