import mongoose from "mongoose";
import { env } from "./env.js";

const uri = `mongodb+srv://${env.dbUsername}:${env.dbPassword}@${env.dbCluster}/${env.dbName}?retryWrites=true&w=majority&appName=${env.dbName}`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;