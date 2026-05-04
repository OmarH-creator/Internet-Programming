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
    joinedCommunities: user.joinedCommunities || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const verifyMyPassword = async (userId, password, options = {}) => {
  const { user: existingUser, errorMessage = "Password is incorrect" } = options;
  const user = existingUser || (await User.findById(userId));

  if (!user) {
    throw createError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError(errorMessage, 401);
  }

  return { success: true, user };
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
    await verifyMyPassword(userId, payload.password || "", {
      user,
      errorMessage: "Current password is incorrect"
    });

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
  if (payload.gender !== undefined) user.gender = payload.gender;

  await user.save();
  return toUserResponse(user);
};

const changeMyPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  await verifyMyPassword(userId, currentPassword, {
    user,
    errorMessage: "Current password is incorrect"
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  return { success: true };
};

const deleteMyAccount = async (userId, password) => {
  await verifyMyPassword(userId, password);

  await User.findByIdAndDelete(userId);
  return { success: true };
};

const updateMyPhoneNumber = async (userId, password, phoneNumber) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  await verifyMyPassword(userId, password, { user });

  user.phoneNumber = phoneNumber;

  await user.save();
  return toUserResponse(user);
};

const toggleCommunity = async (userId, communityName) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const index = user.joinedCommunities.indexOf(communityName);
  if (index === -1) {
    user.joinedCommunities.push(communityName);
  } else {
    user.joinedCommunities.splice(index, 1);
  }

  await user.save();
  return toUserResponse(user);
};

module.exports = {
  getMyProfile,
  updateMyAccount,
  updateMyProfile,
  changeMyPassword,
  updateMyPhoneNumber,
  verifyMyPassword,
  deleteMyAccount,
  toggleCommunity
};