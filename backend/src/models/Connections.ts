import mongoose, { Document, Schema, Model } from "mongoose";

export interface IConnection extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "blocked";
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema: Schema<IConnection> = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    message: {
      type: String,
      default: "Hi, let's connect"
    }
  },
  { timestamps: true }
);

// prevent duplicate connections
connectionSchema.index(
  { senderId: 1, receiverId: 1 },
  { unique: true }
);

const Connection: Model<IConnection> = mongoose.model<IConnection>(
  "Connection",
  connectionSchema
);

export default Connection;