import express from "express";
import logger from "./middlewares/logger.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";


const app = express();

/**
 * ------------------------------------------------------------------
 * Cross-Origin Resource Sharing (CORS)
 * ------------------------------------------------------------------
 */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

/**
 * ------------------------------------------------------------------
 * Parse Incoming JSON
 * ------------------------------------------------------------------
 */
app.use(express.json());

/**
 * ------------------------------------------------------------------
 * Request Logger
 * ------------------------------------------------------------------
 */
app.use(logger);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
/**
 * ------------------------------------------------------------------
 * API Routes with version
 * ------------------------------------------------------------------
 */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tenants", tenantRoutes);

// Must come AFTER all routes
app.use(notFoundHandler);

// Must be the LAST middleware
app.use(errorHandler);

export default app;