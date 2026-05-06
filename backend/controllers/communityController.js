const communityService = require('../services/communityService');

const createCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;
        const creatorId = req.user._id;
        const community = await communityService.createCommunity({ name, description, creatorId });
        return res.status(201).json({
            success: true,
            message: "Community created successfully",
            data: community,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await communityService.getAllCommunities();
        return res.status(200).json({
            success: true,
            data: communities,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getCommunityById = async (req, res) => {
    try {
        const communityId = req.params.id;
        const community = await communityService.getCommunityById(communityId);
        return res.status(200).json({
            success: true,
            data: community,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const joinCommunity = async (req, res) => {
    try {
        const communityId = req.params.id;
        const userId = req.user._id;
        const community = await communityService.joinCommunity(communityId, userId);
        return res.status(200).json({
            success: true,
            message: "Joined community successfully",
            data: community,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const leaveCommunity = async (req, res) => {
    try {
        const communityId = req.params.id;
        const userId = req.user._id;
        const community = await communityService.leaveCommunity(communityId, userId);
        return res.status(200).json({
            success: true,
            message: "Left community successfully",
            data: community,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
};
