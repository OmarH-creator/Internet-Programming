const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Community name is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 21,
      match: [/^[A-Za-z0-9_]+$/, "Community name can only contain letters, numbers, and underscores"]
    },
    description: {
      type: String,
      maxlength: 500,
      default: ""
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    avatar: {
      type: String,
      default: ""
    },
    banner: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Community", communitySchema);
