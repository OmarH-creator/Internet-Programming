const postService = require ('../services/postService')
const { summarizePost } = require('../services/aiService')

const createPost = async (req, res) => {
    try {
        const { title, body, image } = req.body;
        const authorId = req.user._id;
        const post = await postService.createPost({ title, body, authorId, image });
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });

    } catch (error) {   
        return res.status(400).json({
            success: false,
            message: error.message,});
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        return res.status(200).json({
            success: true,
            data: posts,});

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,})
    }
};


const getPostByID = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postService.getPostByID(postId);
        return res.status(200).json({
            success: true,
            data: post});
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,})
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        await postService.deletePost(postId, userId);
        return res.status(200).json({
            success: true,
            message: "Post deleted"});
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,})
    }
};

// Handle upvote
const upvotePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await postService.upvotePost(postId, userId);
        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Handle downvote
const downvotePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await postService.downvotePost(postId, userId);
        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// AI Summarization endpoint
const generateSummary = async (req, res) => {
    try {
        const postId = req.params.id;
        const Post = require('../models/Post');
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // If summary already exists, return it
        if (post.summary) {
            return res.status(200).json({
                success: true,
                message: "Summary already exists",
                data: {
                    postId: post._id,
                    summary: post.summary,
                    isNew: false
                }
            });
        }

        // Set isSummarizing flag
        post.isSummarizing = true;
        await post.save();

        try {
            // Generate summary using AI
            const summary = await summarizePost(post.title, post.body);
            
            // Save summary to post
            post.summary = summary;
            post.isSummarizing = false;
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Summary generated successfully",
                data: {
                    postId: post._id,
                    summary: summary,
                    isNew: true
                }
            });
        } catch (error) {
            // Reset isSummarizing flag on error
            post.isSummarizing = false;
            await post.save();
            throw error;
        }
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostByID,
    deletePost,
    upvotePost,
    downvotePost,
    generateSummary,
};