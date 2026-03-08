import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  photo?: string;
  address?: string;
  pincode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema: Schema<IProfile> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      default: ""
    },

    photo: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);


const Profile: Model<IProfile> = mongoose.model<IProfile>(
  "Profile",
  profileSchema
);

export default Profile;