const express = require("express");
const router = express.Router();

const {
  getMe,
  updateAccount,
  updateProfile,
  changePassword,
  verifyPassword,
  updatePhoneNumber,
  deleteAccount,
  uploadAvatar,
  uploadBanner
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/me", protect, getMe);
router.patch("/me/account", protect, updateAccount);
router.patch("/me/profile", protect, updateProfile);
router.patch("/me/password", protect, changePassword);
router.post("/me/verify-password", protect, verifyPassword);
router.post("/me/avatar-upload", protect, upload.single("image"), uploadAvatar);
router.post("/me/banner-upload", protect, upload.single("image"), uploadBanner);
router.patch("/me/phone-number", protect, updatePhoneNumber);
router.delete("/me", protect, deleteAccount);

module.exports = router;