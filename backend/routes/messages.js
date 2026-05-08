const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Send a message
router.post("/", messageController.sendMessage);

// Get all conversations
router.get("/conversations", messageController.getConversations);

// Get unread count
router.get("/unread", messageController.getUnreadCount);

// Get conversation with specific user
router.get("/:username", messageController.getConversation);

module.exports = router;
