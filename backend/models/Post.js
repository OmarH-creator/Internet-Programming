const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "You must enter a title for your post"],
            minlength: 3,
            maxlength: 300,
        
        },
        body:{
            type: String,
            maxlength: 10000,
            default: "",
        },
        // Image URL from Cloudinary
        image: {
            type: String,
            default: "",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        
        },
        // Array of user IDs who upvoted this post
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        // Array of user IDs who downvoted this post
        downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        
    },
        {
            
            timestamps: true,

        }
);

module.exports = mongoose.model("Post", postSchema);