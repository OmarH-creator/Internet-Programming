const express = require("express")
const router = express.Router()

const { createPost, getAllPosts, getPostByID, deletePost, upvotePost, downvotePost, generateSummary } = require("../controllers/postController");
const { protect } = require("../middleware/auth");

router.get("/", getAllPosts);
router.get("/:id", getPostByID);
router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);

// Vote routes - user must be logged in
router.post("/:id/upvote", protect, upvotePost);
router.post("/:id/downvote", protect, downvotePost);

// AI Summarization route - user must be logged in
router.post("/:id/summarize", protect, generateSummary);

module.exports = router;