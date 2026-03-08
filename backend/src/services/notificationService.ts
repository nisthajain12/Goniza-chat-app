import Notification from "../models/Notification";
import mongoose from "mongoose";

class NotificationService {

    async createNotification(data: {
  userId: string,
  actorId: string,
  connectionId: string,
  action: "request_sent" | "request_accepted" | "request_rejected"
}) {

  try {
    await Notification.create({
      userId: data.userId,
      actorId: data.actorId,
      connectionId: data.connectionId,
      action: data.action
    });
  } catch (err) {
    console.log("Notification creation failed:", err);
  }

}

    async getUserNotifications(userId: string) {
  return Notification.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "connections",
        localField: "connectionId",
        foreignField: "_id",
        as: "connection"
      }
    },
    {
      $unwind: "$connection"
    },

    {
      $project: {
        action: 1,
        createdAt: 1,
        actorId: {
          $cond: [
            { $eq: ["$action", "request_sent"] },
            "$connection.senderId",
            "$connection.receiverId"
          ]
        }
      }
    },

    {
      $lookup: {
        from: "profiles",
        localField: "actorId",
        foreignField: "user",
        as: "actorProfile"
      }
    },
    {
      $unwind: "$actorProfile"
    },

    {
      $project: {
        _id: 1,
        name: "$actorProfile.name",
        action: 1,
        createdAt: 1
      }
    },

    {
      $sort: { createdAt: -1 }
    }
  ]);
}   

}

export default new NotificationService();