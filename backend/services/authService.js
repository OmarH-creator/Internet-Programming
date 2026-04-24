const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

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
    phoneNumber: user.phoneNumber || "",
    avatar: user.avatar || "",
    banner: user.banner || "",
    avatarUrl: user.avatar || "",
    bannerUrl: user.banner || "",
    bio: user.bio || "",
    gender: user.gender || "",
    karma: user.karma ?? 0,
    postKarma: user.postKarma ?? 0,
    commentKarma: user.commentKarma ?? 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const toAuthPayload = (user) => {
  return {
    token: generateToken(user._id),
    user: toUserResponse(user)
  };
};

const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existing) {
    if (existing.username === username) {
      throw createError("Username already taken", 409);
    }
    if (existing.email === email) {
      throw createError("Email already in use", 409);
    }
    throw createError("User already exists", 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  return toAuthPayload(user);
};

const loginUser = async ({ identifier, password }) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError("Invalid credentials", 401);
  }

  return toAuthPayload(user);
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw createError("User not found", 404);
  }

  return toUserResponse(user);
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};