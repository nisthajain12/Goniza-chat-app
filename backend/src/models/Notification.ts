import mongoose, { Schema, Model } from "mongoose";

export interface INotification {
  userId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  connectionId: mongoose.Types.ObjectId;
  action: "request_sent" | "request_accepted" | "request_rejected";
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true
    },

    action: {
      type: String,
      enum: ["request_sent", "request_accepted", "request_rejected"],
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Notification: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;