const postService = require ('../services/postService')

const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const authorId = req.user._id;
        const post = await postService.createPost({ title, body, authorId });
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

module.exports = {
    createPost,
    getAllPosts,
    getPostByID,
    deletePost,
};