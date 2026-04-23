const express = require("express")
const router = express.Router()

const { createPost, getAllPosts, getPostByID, deletePost } = require("../controllers/postController");
const { protect } = require("../middleware/auth");

router.get("/", getAllPosts);
router.get("/:id", getPostByID);
router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);

module.exports = router;