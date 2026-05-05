const Post = require ('../models/Post');
const { uploadImage } = require('../utils/uploadImage');

const createError = (message, statusCode) => {
    const error= new Error(message);
    error.statusCode = statusCode;
    return error;
};

const createPost = async ({title, body, authorId, image}) =>{
    // Upload image to Cloudinary if provided
    let imageUrl = "";
    if (image) {
        imageUrl = await uploadImage(image);
    }

    const post = await Post.create({
        title,
        body,
        image: imageUrl,
        author: authorId
    });
    return post;
};

const getAllPosts = async () => {
    const posts = await Post.find()
        .populate ("author", "username avatar")
        .sort({createdAt: -1});
    
    // Add comment count to each post
    const Comment = require('../models/Comment');
    const postsWithCommentCount = await Promise.all(
        posts.map(async (post) => {
            const commentCount = await Comment.countDocuments({ post: post._id });
            return {
                ...post.toObject(),
                commentCount
            };
        })
    );
    
    return postsWithCommentCount;
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

// Upvote a post
const upvotePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw createError("Post not found", 404);
    }

    // Remove from downvotes if user previously downvoted
    post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());

    // Check if user already upvoted
    const alreadyUpvoted = post.upvotes.some(id => id.toString() === userId.toString());
    
    if (alreadyUpvoted) {
        // Remove upvote (toggle off)
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
        // Add upvote
        post.upvotes.push(userId);
    }

    await post.save();
    
    // Populate author before returning
    await post.populate("author", "username avatar");
    return post;
};

// Downvote a post
const downvotePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw createError("Post not found", 404);
    }

    // Remove from upvotes if user previously upvoted
    post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());

    // Check if user already downvoted
    const alreadyDownvoted = post.downvotes.some(id => id.toString() === userId.toString());
    
    if (alreadyDownvoted) {
        // Remove downvote (toggle off)
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
    } else {
        // Add downvote
        post.downvotes.push(userId);
    }

    await post.save();
    
    // Populate author before returning
    await post.populate("author", "username avatar");
    return post;
};

module.exports = {
    createPost,
    getAllPosts,
    getPostByID,
    deletePost,
    upvotePost,
    downvotePost,
};