import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  participants: mongoose.Types.ObjectId[];
  roomType: "personal" | "group";
  roomName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

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

/*
Prevent duplicate personal rooms between same two users.
IMPORTANT:
Always sort participants before saving.
*/
roomSchema.index(
  { participants: 1, roomType: 1 },
  { unique: false }
);

const Room: Model<IRoom> = mongoose.model<IRoom>(
  "Room",
  roomSchema
);

export default Room;