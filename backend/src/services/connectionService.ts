
import Connection from "../models/Connections";
import roomService from "./roomService";
import mongoose from "mongoose";
import Notification from "../models/Notification";
import notificationService from "./notificationService";
type InvitationStatus = "accepted" | "rejected";

interface RespondToInvitationParams {
  connectionId: string;
  userId: string;
  status: InvitationStatus;

}
class ConnectionService {
  async respondToInvitation(params: RespondToInvitationParams) {
    const { connectionId, userId, status } = params;

    //find connection
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      throw new Error("Connection does not exist ");
    }

    //only receiver accepts connection
    if (connection.receiverId.toString() !== userId) {
      throw new Error("Not allowed");
    }

    //prevent double accept clicking like double response
    if (connection.status !== "pending") {
      throw new Error("Already responded");
    }

    //update status
connection.status = status;
await connection.save();

// notify sender
await notificationService.createNotification({
  userId: connection.senderId.toString(),
  actorId: connection.receiverId.toString(),
  connectionId: connection._id.toString(),
  action: status === "accepted"
    ? "request_accepted"
    : "request_rejected"
});

if (status === "rejected") {
  return {
    success: true,
    message: "Connection rejected"
  };
}

    const room = await roomService.createRoom({
      participants: [
        connection.senderId.toString(),
        connection.receiverId.toString()
      ]
    });

    return {
      success: true,
      message: "Connection accepted",
      room
    };
  }

  async getAcceptedConnections(userId: string) {
    const connections = await Connection.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ],
          status: "accepted"
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
        $lookup: {
          from: "profiles",
          localField: "receiverId",
          foreignField: "user",
          as: "receiverProfile"
        }
      },
      {
        $project: {
          senderId: 1,
          receiverId: 1,
          senderProfile: { $arrayElemAt: ["$senderProfile", 0] },
          receiverProfile: { $arrayElemAt: ["$receiverProfile", 0] }
        }
      }
    ]);

    const formattedConnections = connections.map((conn) => {
      const isSender = conn.senderId.toString() === userId;

      const profile = isSender
        ? conn.receiverProfile
        : conn.senderProfile;

      return {
        userId: profile?.user,
        name: profile?.name
      };
    });

    return formattedConnections;
  }
}
export default new ConnectionService();