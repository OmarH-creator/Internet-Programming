const Community = require('../models/Community');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const createCommunity = async ({ name, description, creatorId }) => {
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
        throw createError("Community with this name already exists", 400);
    }

    const community = await Community.create({
        name,
        description,
        creator: creatorId,
        members: [creatorId],
        admins: []
    });
    return community;
};

const getAllCommunities = async () => {
    return await Community.find().populate("creator", "username");
};

const getCommunityById = async (communityId) => {
    const community = await Community.findById(communityId)
        .populate("creator", "username")
        .populate("members", "username avatar")
        .populate("admins", "username avatar");
    if (!community) {
        throw createError("Community not found", 404);
    }
    return community;
};

const joinCommunity = async (communityId, userId) => {
    const community = await Community.findById(communityId);
    if (!community) {
        throw createError("Community not found", 404);
    }

    if (community.members.includes(userId)) {
        return community;
    }

    community.members.push(userId);
    await community.save();
    return community;
};

const leaveCommunity = async (communityId, userId) => {
    const community = await Community.findById(communityId);
    if (!community) {
        throw createError("Community not found", 404);
    }

    community.members = community.members.filter(id => id.toString() !== userId.toString());
    community.admins = community.admins.filter(id => id.toString() !== userId.toString());
    await community.save();
    return community;
};

const searchCommunities = async (query) => {
    if (!query) return [];
    const communities = await Community.find({
        name: { $regex: query, $options: 'i' }
    })
    .select('_id name avatar members')
    .limit(5);

    return communities;
};

const updateCommunityProfile = async (communityId, userId, updateData) => {
    const community = await Community.findById(communityId);
    if (!community) {
        throw createError("Community not found", 404);
    }

    const isAdmin = community.admins.some(adminId => adminId.toString() === userId.toString());
    const isCreator = community.creator.toString() === userId.toString();

    if (!isCreator && !isAdmin) {
        throw createError("Only the creator or admins can update the community profile", 403);
    }

    Object.assign(community, updateData);
    await community.save();
    return community;
};

const kickMember = async (communityId, adminId, targetUserId) => {
    const community = await Community.findById(communityId);
    if (!community) {
        throw createError("Community not found", 404);
    }

    const isAdmin = community.admins.some(id => id.toString() === adminId.toString());
    const isCreator = community.creator.toString() === adminId.toString();

    if (!isCreator && !isAdmin) {
        throw createError("Only the creator or admins can kick members", 403);
    }

    if (targetUserId.toString() === community.creator.toString()) {
        throw createError("Cannot kick the community creator", 400);
    }

    const targetIsAdmin = community.admins.some(id => id.toString() === targetUserId.toString());
    if (targetIsAdmin && !isCreator) {
        throw createError("Only the creator can kick other admins", 403);
    }

    community.members = community.members.filter(id => id.toString() !== targetUserId.toString());
    community.admins = community.admins.filter(id => id.toString() !== targetUserId.toString());
    await community.save();
    return community;
};

const promoteToAdmin = async (communityId, ownerId, targetUserId) => {
    const community = await Community.findById(communityId);
    if (!community) {
        throw createError("Community not found", 404);
    }

    if (community.creator.toString() !== ownerId.toString()) {
        throw createError("Only the creator can promote members to admin", 403);
    }

    if (!community.members.some(id => id.toString() === targetUserId.toString())) {
        throw createError("User must be a member of the community", 400);
    }

    if (community.admins.some(id => id.toString() === targetUserId.toString())) {
        return community; // Already an admin
    }

    community.admins.push(targetUserId);
    await community.save();
    return community;
};

module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    searchCommunities,
    updateCommunityProfile,
    kickMember,
    promoteToAdmin
};
