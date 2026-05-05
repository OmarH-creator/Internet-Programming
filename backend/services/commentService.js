const Comment = require('../models/Comment');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Create a comment
const createComment = async ({ text, authorId, postId, parentCommentId = null }) => {
    const comment = await Comment.create({
        text,
        author: authorId,
        post: postId,
        parentComment: parentCommentId
    });
    
    // Populate author info
    await comment.populate("author", "username avatar");
    return comment;
};

// Get all comments for a post
const getCommentsByPost = async (postId) => {
    const comments = await Comment.find({ post: postId })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 }); // Newest first
    return comments;
};

// Delete a comment
const deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw createError("Comment not found", 404);
    }
    if (comment.author.toString() !== userId.toString()) {
        throw createError("Not allowed", 403);
    }
    await comment.deleteOne();
};

// Upvote a comment
const upvoteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw createError("Comment not found", 404);
    }

    // Remove from downvotes
    comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());

    // Toggle upvote
    const alreadyUpvoted = comment.upvotes.some(id => id.toString() === userId.toString());
    if (alreadyUpvoted) {
        comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
        comment.upvotes.push(userId);
    }

    await comment.save();
    await comment.populate("author", "username avatar");
    return comment;
};

// Downvote a comment
const downvoteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw createError("Comment not found", 404);
    }

    // Remove from upvotes
    comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());

    // Toggle downvote
    const alreadyDownvoted = comment.downvotes.some(id => id.toString() === userId.toString());
    if (alreadyDownvoted) {
        comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
    } else {
        comment.downvotes.push(userId);
    }

    await comment.save();
    await comment.populate("author", "username avatar");
    return comment;
};

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment,
    upvoteComment,
    downvoteComment,
};
