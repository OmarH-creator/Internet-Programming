const express = require("express");
const router = express.Router();

const { createComment, getCommentsByPost, deleteComment, upvoteComment, downvoteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

// Get comments for a post
router.get("/post/:postId", getCommentsByPost);

// Create a comment (must be logged in)
router.post("/post/:postId", protect, createComment);

// Delete a comment (must be logged in)
router.delete("/:commentId", protect, deleteComment);

// Vote on comments
router.post("/:commentId/upvote", protect, upvoteComment);
router.post("/:commentId/downvote", protect, downvoteComment);

module.exports = router;
