
import express from "express";
import { auth } from "../middleware/auth.js";
import { logActivity } from "../controllers/activityController.js";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", logActivity);

export default router;
