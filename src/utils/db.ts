import mongoose from "mongoose";
import { logger } from "./logger.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://yt727883:wTg5f7j1Ju3y0iQN@cluster0.1tsxm.mongodb.net/ai-therapist";

if (!MONGODB_URI) {
  throw new Error(" MONGODB_URI is missing in .env file");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
