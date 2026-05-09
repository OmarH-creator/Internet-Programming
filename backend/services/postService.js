const Post = require ('../models/Post');
const Community = require('../models/Community');
const { uploadImage } = require('../utils/uploadImage');

const createError = (message, statusCode) => {
    const error= new Error(message);
    error.statusCode = statusCode;
    return error;
};

const createPost = async ({title, body, authorId, image, communityId}) =>{
    // Upload image to Cloudinary if provided
    let imageUrl = "";
    if (image) {
        imageUrl = await uploadImage(image);
    }

    const post = await Post.create({
        title,
        body,
        image: imageUrl,
        author: authorId,
        community: communityId || null
    });
    return post;
};

const getAllPosts = async (communityId) => {
    const query = communityId ? { community: communityId } : {};
    const posts = await Post.find(query)
        .populate ("author", "username avatar")
        .populate ("community", "name creator admins")
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
        .populate("author", "username avatar")
        .populate("community", "name creator admins");
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
    
    let isAllowed = post.author.toString() === userId.toString();

    if (!isAllowed && post.community) {
        const community = await Community.findById(post.community);
        if (community) {
            const isCreator = community.creator.toString() === userId.toString();
            const isAdmin = community.admins.some(adminId => adminId.toString() === userId.toString());
            if (isCreator || isAdmin) {
                isAllowed = true;
            }
        }
    }

    if (!isAllowed) {
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