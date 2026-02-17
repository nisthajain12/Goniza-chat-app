const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name:  {
      type: String,
      required: true
    },
  phone: String,
  photo: String,
  address: String,
  pincode: String,

  isComplete: {
  type: Boolean,
  default: false
}


});

module.exports = mongoose.model("Profile", profileSchema);
