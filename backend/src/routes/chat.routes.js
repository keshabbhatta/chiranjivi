const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  createOrGetConversation,
  sendMessage,
} = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected routes
router.use(protect);

// Get all conversations for current user
router.get("/conversations", getConversations);

// Get or create conversation with specific user
router.post("/conversation", createOrGetConversation);

// Get messages from a conversation
router.get("/messages/:conversationId", getMessages);

// Send message (API fallback for non-socket sends)
router.post("/message", sendMessage);

module.exports = router;