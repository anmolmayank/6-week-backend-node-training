import express from "express";
import logger from "./middlewares/logger.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

app.use(express.json());

app.use(logger);

/**
 * ------------------------------------------------------------------
 * API Routes with version
 * ------------------------------------------------------------------
 */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// Must come AFTER all routes
app.use(notFoundHandler);

// Must be the LAST middleware
app.use(errorHandler);

export default app;