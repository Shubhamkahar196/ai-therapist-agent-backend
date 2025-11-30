import { Router } from "express";
import {
  createChatSession,
  sendMessage,
  getSessionHistory,
  getChatSession,
  getChatHistory,
} from "../controllers/chat.js";
import { auth } from "../middleware/auth.js";
import { ChatSession } from "../models/ChatSession.js";
import { Types } from "mongoose";

const router = Router();

// Apply auth middleware to all chat routes
router.use(auth);

// GET /chat/sessions - Get all chat sessions for the authenticated user
router.get("/sessions", async (req, res) => {
  try {
    const userId = new Types.ObjectId(req.user.id);
    const sessions = await ChatSession.find({ userId }).sort({ startTime: -1 });

    res.json({
      sessions: sessions.map(session => ({
        sessionId: session.sessionId,
        startTime: session.startTime,
        status: session.status,
        messageCount: session.messages.length,
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching chat sessions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /chat/sessions - Create a new chat session
router.post("/sessions", createChatSession);

// GET /chat/sessions/:sessionId - Get a specific chat session
router.get("/sessions/:sessionId", getChatSession);

// GET /chat/sessions/:sessionId/history - Get chat history for a session
router.get("/sessions/:sessionId/history", getChatHistory);

// POST /chat/sessions/:sessionId/messages - Send a message in a chat session
router.post("/sessions/:sessionId/messages", sendMessage);

export default router;
