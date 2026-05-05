const messageService = require("../services/messageService");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverUsername, content } = req.body;

    if (!receiverUsername || !content) {
      return res.status(400).json({
        success: false,
        message: "Receiver username and content are required",
      });
    }

    const message = await messageService.sendMessage(
      req.user.id,
      receiverUsername,
      content
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get conversation with a user
exports.getConversation = async (req, res) => {
  try {
    const { username } = req.params;

    const messages = await messageService.getConversation(
      req.user.id,
      username
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await messageService.getConversations(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await messageService.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
