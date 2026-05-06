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
        members: [creatorId]
    });
    return community;
};

const getAllCommunities = async () => {
    return await Community.find().populate("creator", "username");
};

const getCommunityById = async (communityId) => {
    const community = await Community.findById(communityId)
        .populate("creator", "username")
        .populate("members", "username avatar");
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
    await community.save();
    return community;
};

module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity
};
