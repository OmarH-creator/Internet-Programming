const communityService = require('../services/communityService');
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");

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

const searchCommunities = async (req, res) => {
    try {
        const query = req.query.q;
        const communities = await communityService.searchCommunities(query);
        
        return res.status(200).json({
            success: true,
            data: { communities },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};

const uploadCommunityAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        const communityId = req.params.id;
        const result = await uploadBufferToCloudinary(
            req.file.buffer,
            "reddit-clone/community-avatars",
            `community_avatar_${communityId}`
        );

        const community = await communityService.updateCommunityProfile(communityId, req.user._id, {
            avatar: result.secure_url
        });

        return res.status(200).json({
            success: true,
            message: "Community avatar uploaded successfully",
            data: community
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Community avatar upload failed"
        });
    }
};

const uploadCommunityBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        const communityId = req.params.id;
        const result = await uploadBufferToCloudinary(
            req.file.buffer,
            "reddit-clone/community-banners",
            `community_banner_${communityId}`
        );

        const community = await communityService.updateCommunityProfile(communityId, req.user._id, {
            banner: result.secure_url
        });

        return res.status(200).json({
            success: true,
            message: "Community banner uploaded successfully",
            data: community
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Community banner upload failed"
        });
    }
};

module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    searchCommunities,
    uploadCommunityAvatar,
    uploadCommunityBanner
};
