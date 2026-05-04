const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Comment text is required"],
            maxlength: 10000,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        // Parent comment for replies (null if top-level comment)
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        // Upvotes and downvotes
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", commentSchema);
