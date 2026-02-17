const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true
    },

    roomType: {
      type: String,
      enum: ["personal", "group"],
      default: "personal"
    },

    roomName: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
