/**
 * ============================================================================
 * File: db.ts
 * Layer: Configuration
 * ============================================================================
 *
 * Purpose
 * -------
 * Establishes the MongoDB connection.
 *
 * Responsibilities
 * ----------------
 * - Build MongoDB Atlas connection string.
 * - Connect to MongoDB.
 * - Handle connection failures.
 *
 * ============================================================================
 */

import mongoose from "mongoose";

import { env } from "./env.js";

/**
 * ============================================================================
 * MongoDB Connection URI
 * ============================================================================
 */
const uri = `mongodb+srv://${env.dbUsername}:${env.dbPassword}@${env.dbCluster}/${env.dbName}?retryWrites=true&w=majority&appName=${env.dbName}`;

/**
 * ============================================================================
 * Connect Database
 * ============================================================================
 */
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(uri);

        console.log(
            "✅ MongoDB Atlas connected successfully."
        );
    } catch (error: unknown) {
        console.error(
            "❌ MongoDB connection failed."
        );

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }

        process.exit(1);
    }
};

export default connectDB;