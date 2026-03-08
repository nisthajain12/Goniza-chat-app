import mongoose, { Schema, Model, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  body: string;
  attachments?: string[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true
    },

    body: {
      type: String,
      default: ""
    },

    attachments: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model(
  "Message",
  messageSchema
);

export default Message;