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
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        
        },
        
    },
        {
            
            timestamps: true,

        }
);

module.exports = mongoose.model("Post", postSchema);