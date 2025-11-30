import express from 'express'
import type {Request, Response} from 'express'
import { inngest, functions } from "./inngest/functions.js"
import { logger } from "./utils/logger.js";
import { connectDB } from './utils/db.js';

import  dotenv from "dotenv";
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();


const app = express();


// middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// parse json body
app.use(express.json())

// routes
app.use("/auth",authRoutes);

// error handling
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(
        `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
