const express = require("express");
const router = express.Router();

const {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    searchCommunities,
    uploadCommunityAvatar,
    uploadCommunityBanner,
    kickMember,
    promoteToAdmin
} = require("../controllers/communityController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/search", searchCommunities);
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/", protect, createCommunity);
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);
router.post("/:id/avatar", protect, upload.single("image"), uploadCommunityAvatar);
router.post("/:id/banner", protect, upload.single("image"), uploadCommunityBanner);
router.post("/:id/kick/:userId", protect, kickMember);
router.post("/:id/promote/:userId", protect, promoteToAdmin);

module.exports = router;
