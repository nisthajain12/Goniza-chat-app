import Message from "../models/Message";
import mongoose from "mongoose";

class MessageService {

  async createMessage(params: {
    senderId: string;
    roomId: string;
    body?: string;
    attachments?: string[];
  }) {

    const { senderId, roomId, body, attachments } = params;

    const message = await Message.create({
      senderId,
      roomId,
      body,
      attachments
    });

    return message;
  }

  async getRoomMessages(roomId: string) {

    const messages = await Message.aggregate([
      {
        $match: {
          roomId: new mongoose.Types.ObjectId(roomId)
        }
      },

      {
        $lookup: {
          from: "profiles",
          localField: "senderId",
          foreignField: "user",
          as: "senderProfile"
        }
      },

      {
        $unwind: {
          path: "$senderProfile",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          _id: 1,
          body: 1,
          attachments: 1,
          createdAt: 1,
          senderId: 1,
          senderName: "$senderProfile.name"
        }
      },

      {
        $sort: { createdAt: 1 }
      }
    ]);

    return messages;
  }

}

export default new MessageService();