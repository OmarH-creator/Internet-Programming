const userService = require("../services/userService");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");
const {
  normalizeUpdateAccountInput,
  validateUpdateAccountInput,
  normalizeUpdateProfileInput,
  validateUpdateProfileInput,
  normalizeChangePasswordInput,
  validateChangePasswordInput,
  normalizeDeleteAccountInput,
  validateDeleteAccountInput,
  normalizeUpdatePhoneInput,
  validateUpdatePhoneInput
} = require("../utils/authValidation");

const getMe = async (req, res) => {
  try {
    const user = await userService.getMyProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || "User not found"
    });
  }
};

const updateAccount = async (req, res) => {
  try {
    const normalized = normalizeUpdateAccountInput(req.body);
    const { isValid, errors } = validateUpdateAccountInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const user = await userService.updateMyAccount(req.user.id, normalized);

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Account update failed"
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const normalized = normalizeUpdateProfileInput(req.body);
    const { isValid, errors } = validateUpdateProfileInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const user = await userService.updateMyProfile(req.user.id, normalized);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Profile update failed"
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "reddit-clone/avatars",
      `avatar_${req.user.id}`
    );

    const user = await userService.updateMyProfile(req.user.id, {
      avatar: result.secure_url
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Avatar upload failed"
    });
  }
};

const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "reddit-clone/banners",
      `banner_${req.user.id}`
    );

    const user = await userService.updateMyProfile(req.user.id, {
      banner: result.secure_url
    });

    return res.status(200).json({
      success: true,
      message: "Banner uploaded successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Banner upload failed"
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const normalized = normalizeChangePasswordInput(req.body);
    const { isValid, errors } = validateChangePasswordInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    await userService.changeMyPassword(
      req.user.id,
      normalized.currentPassword,
      normalized.newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Password change failed"
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const normalized = normalizeDeleteAccountInput(req.body);
    const { isValid, errors } = validateDeleteAccountInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    await userService.deleteMyAccount(req.user.id, normalized.password);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Account deletion failed"
    });
  }
};

const updatePhoneNumber = async (req, res) => {
  try {
    const normalized = normalizeUpdatePhoneInput(req.body);
    const { isValid, errors } = validateUpdatePhoneInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const user = await userService.updateMyPhoneNumber(
      req.user.id,
      normalized.password,
      normalized.phoneNumber
    );

    return res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Phone number update failed"
    });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const normalized = normalizeDeleteAccountInput(req.body);
    const { isValid, errors } = validateDeleteAccountInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    await userService.verifyMyPassword(req.user.id, normalized.password);

    return res.status(200).json({
      success: true,
      message: "Password verified"
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Password verification failed"
    });
  }
};

// Get user's posts by username
const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const posts = await userService.getUserPosts(username);

    return res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || "Failed to get user posts"
    });
  }
};

// Get user's comments by username
const getUserComments = async (req, res) => {
  try {
    const username = req.params.username;
    const comments = await userService.getUserComments(username);

    return res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || "Failed to get user comments"
    });
  }
};

module.exports = {
  getMe,
  updateAccount,
  updateProfile,
  changePassword,
  verifyPassword,
  deleteAccount,
  updatePhoneNumber,
  uploadAvatar,
  uploadBanner,
  getUserPosts,
  getUserComments
};