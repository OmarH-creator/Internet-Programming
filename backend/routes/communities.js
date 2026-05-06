const express = require("express");
const router = express.Router();

const {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity
} = require("../controllers/communityController");
const { protect } = require("../middleware/auth");

router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/", protect, createCommunity);
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);

module.exports = router;
