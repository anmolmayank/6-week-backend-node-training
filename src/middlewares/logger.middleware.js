const logger = (req, res, next) => {
  console.log("===================================");

  console.log("Time :", new Date().toISOString());

  console.log("Method :", req.method);

  console.log("URL :", req.originalUrl);

  console.log("===================================");

  next();
};

export default logger;
