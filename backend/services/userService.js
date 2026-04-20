const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const toUserResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    displayName: user.username,
    email: user.email,
    avatar: user.avatar || "",
    banner: user.banner || "",
    avatarUrl: user.avatar || "",
    bannerUrl: user.banner || "",
    bio: user.bio || "",
    karma: user.karma ?? 0,
    postKarma: user.postKarma ?? 0,
    commentKarma: user.commentKarma ?? 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw createError("User not found", 404);
  }

  return toUserResponse(user);
};

const updateMyAccount = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (payload.email !== undefined) {
    const existing = await User.findOne({
      email: payload.email,
      _id: { $ne: userId }
    });

    if (existing) {
      throw createError("Email already in use", 409);
    }

    user.email = payload.email;
  }

  await user.save();
  return toUserResponse(user);
};

const updateMyProfile = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (payload.avatar !== undefined) user.avatar = payload.avatar;
  if (payload.banner !== undefined) user.banner = payload.banner;
  if (payload.bio !== undefined) user.bio = payload.bio;

  await user.save();
  return toUserResponse(user);
};

const changeMyPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw createError("Current password is incorrect", 401);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  return { success: true };
};

const deleteMyAccount = async (userId, password) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError("Password is incorrect", 401);
  }

  await User.findByIdAndDelete(userId);
  return { success: true };
};

module.exports = {
  getMyProfile,
  updateMyAccount,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount
};