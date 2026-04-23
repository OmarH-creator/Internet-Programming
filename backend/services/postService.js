const Post = require ('../models/Post');

const createError = (message, statusCode) => {
    const error= new Error(message);
    error.statusCode = statusCode;
    return error;
};

const createPost = async ({title, body, authorId}) =>{
    const post = await Post.create({
        title,
        body,
        author: authorId
    });
    return post;
};

const getAllPosts = async () => {
    const posts = await Post.find()
        .populate ("author", "username avatar")
        .sort({createdAt: -1});
    return posts;
};

const getPostByID = async (postId) => {
    const post = await Post.findById(postId)
        .populate("author", "username avatar");
    if (!post) {
        throw createError("Post not found", 404);
    }
    return post;
};

const deletePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw createError("Post not found", 404);
    }
    if (post.author.toString() !== userId.toString()) {
        throw createError("Not allowed", 403);
    }
    await post.deleteOne();
};

module.exports = {
    createPost,
    getAllPosts,
    getPostByID,
    deletePost,
};