import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "NODE_ENV",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_CLUSTER",
  "DB_NAME",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbCluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};
