const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "agent"],
      default: "agent",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
       type: String,
      default: null,
},

  resetPasswordExpires: {
     type: Date,
     default: null,
},
  },

    
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;