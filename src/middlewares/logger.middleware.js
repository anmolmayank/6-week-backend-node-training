const logger = (req, res, next) => {
  console.log("===================================");

  console.log("Time :", new Date().toISOString());

  console.log("Method :", req.method);

  console.log("URL :", req.originalUrl);

  console.log("===================================");

  /*
    If you pass the exact string 'route', Express does not treat it as an error. 
    Instead, it skips the rest of the functions in the current route block and 
    jumps straight to the next matching route definition. */
  /* Calling next() with no arguments tells Express to pass control immediately 
    to the subsequent middleware function in the execution queue. */
  /* When you pass a value inside next(), Express interprets it as an error, 
    with only one exception. */
  next();
};

export default logger;
