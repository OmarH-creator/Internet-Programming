const Message = require("../models/Message");
const User = require("../models/User");

// Send a message
exports.sendMessage = async (senderId, receiverUsername, content) => {
  // Find receiver by username
  const receiver = await User.findOne({ username: receiverUsername });
  
  if (!receiver) {
    throw new Error("User not found");
  }

  if (receiver._id.toString() === senderId) {
    throw new Error("Cannot send message to yourself");
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiver._id,
    content,
  });

  await message.populate("sender", "username avatar");
  await message.populate("receiver", "username avatar");

  return message;
};

// Get conversation between two users
exports.getConversation = async (userId, otherUsername) => {
  const otherUser = await User.findOne({ username: otherUsername });
  
  if (!otherUser) {
    throw new Error("User not found");
  }

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUser._id },
      { sender: otherUser._id, receiver: userId },
    ],
  })
    .populate("sender", "username avatar")
    .populate("receiver", "username avatar")
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    { sender: otherUser._id, receiver: userId, read: false },
    { read: true }
  );

  return messages;
};

// Get all conversations (list of users you've chatted with)
exports.getConversations = async (userId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "username avatar")
    .populate("receiver", "username avatar")
    .sort({ createdAt: -1 });

  // Get unique users
  const userMap = new Map();
  
  messages.forEach((msg) => {
    const otherUser = msg.sender._id.toString() === userId 
      ? msg.receiver 
      : msg.sender;
    
    const otherUserId = otherUser._id.toString();
    
    if (!userMap.has(otherUserId)) {
      userMap.set(otherUserId, {
        user: otherUser,
        lastMessage: msg.content,
        lastMessageTime: msg.createdAt,
        unread: msg.receiver._id.toString() === userId && !msg.read,
      });
    }
  });

  return Array.from(userMap.values());
};

// Get unread message count
exports.getUnreadCount = async (userId) => {
  const count = await Message.countDocuments({
    receiver: userId,
    read: false,
  });
  
  return count;
};
