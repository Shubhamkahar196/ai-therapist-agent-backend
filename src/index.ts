// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import dotenv from "dotenv";
// import { serve } from "inngest/express";
// import { errorHandler } from "./middleware/errorHandler.js";
// import { logger } from "./utils/logger.js";
// import authRouter from "./routes/auth.js";
// import chatRouter from "./routes/chat.js";
// import moodRouter from "./routes/mood.js";
// import activityRouter from "./routes/activity.js";
// import { connectDB } from "./utils/db.js";
// import { inngest } from "./inngest/client.js";
// import { functions as inngestFunctions } from "./inngest/functions.js";

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON bodies
// app.use(morgan("dev")); // HTTP request logger

// // Set up Inngest endpoint
// app.use(
//   "/api/inngest",
//   serve({ client: inngest, functions: inngestFunctions })
// );
// // OnaF6EGHhgYY9OPv

// // Routes
// app.get("/health", (req, res) => {
//   res.json({ status: "ok", message: "Server is running" });
// });

// app.use("/auth", authRouter);
// app.use("/chat", chatRouter);
// app.use("/api/mood", moodRouter);
// app.use("/api/activity", activityRouter);

// // Error handling middleware
// app.use(errorHandler);

// // Start server
// const startServer = async () => {
//   try {
//     // Connect to MongoDB first
//     await connectDB();

//     // Then start the server
//     const PORT = process.env.PORT || 3001;
//     app.listen(PORT, () => {
//       logger.info(`Server is running on port ${PORT}`);
//       logger.info(
//         `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
//       );
//     });
//   } catch (error) {
//     logger.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();






import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import moodRouter from "./routes/mood.js";
import activityRouter from "./routes/activity.js";
import { connectDB } from "./utils/db.js";
import { inngest } from "./inngest/client.js";
import { functions as inngestFunctions } from "./inngest/functions.js";

// Load environment variables
dotenv.config();

const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL || "https://aura-ivory-two.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Dynamic origin function for cors options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Not allowed
    return callback(new Error(`CORS policy: Origin ${origin} is not allowed`), false);
  },
  credentials: true, // allow set-cookie and other credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Use security & parsing middleware BEFORE routes
app.use(helmet());
// Apply CORS with our options BEFORE routes so preflight and credentials behave
app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options("*", cors(corsOptions));

app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // HTTP request logger

// Set up Inngest endpoint
app.use(
  "/api/inngest",
  serve({ client: inngest, functions: inngestFunctions })
);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);

// Error handling middleware - keep this after routes
app.use(errorHandler);

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

export default app;
