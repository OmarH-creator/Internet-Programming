const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8
    },
    phoneNumber: {
      type: String,
      trim : true,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    banner: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      maxlength: 300
    },
    gender: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ""
    },
    karma: {
      type: Number,
      default: 0,
      min : 0
    },
    postKarma: {
      type: Number,
      default: 0,
      min : 0
    },
    commentKarma: {
      type: Number,
      default: 0,
      min : 0
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("displayName").get(function () {
  return this.username;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);