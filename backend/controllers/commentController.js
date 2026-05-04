const commentService = require('../services/commentService');

// Create a comment
const createComment = async (req, res) => {
    try {
        const { text, parentCommentId } = req.body;
        const { postId } = req.params;
        const authorId = req.user._id;
        
        const comment = await commentService.createComment({ text, authorId, postId, parentCommentId });
        
        return res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get comments for a post
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPost(postId);
        
        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        
        await commentService.deleteComment(commentId, userId);
        
        return res.status(200).json({
            success: true,
            message: "Comment deleted",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Upvote a comment
const upvoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        
        const comment = await commentService.upvoteComment(commentId, userId);
        
        return res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Downvote a comment
const downvoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        
        const comment = await commentService.downvoteComment(commentId, userId);
        
        return res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment,
    upvoteComment,
    downvoteComment,
};
