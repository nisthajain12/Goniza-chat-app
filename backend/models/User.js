const mongoose = require("mongoose");
const Profile = require("./Profile");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    profilePic: {
      type: String,
      default: ""
    },
    Profile:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Profile"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
