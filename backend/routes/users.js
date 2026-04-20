const express = require("express");
const router = express.Router();

const {
  getMe,
  updateAccount,
  updateProfile,
  changePassword,
  deleteAccount
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");

router.get("/me", protect, getMe);
router.patch("/me/account", protect, updateAccount);
router.patch("/me/profile", protect, updateProfile);
router.patch("/me/password", protect, changePassword);
router.delete("/me", protect, deleteAccount);

module.exports = router;