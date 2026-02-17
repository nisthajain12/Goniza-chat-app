const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending"
    },

    message:{
      type:String,
      default: "Hi, lets connect"
    }


  },
  { timestamps: true }
);

// Prevent duplicate connections
connectionSchema.index(
  { senderId: 1, receiverId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Connection", connectionSchema);
