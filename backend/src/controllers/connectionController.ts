import { Request, Response } from "express";
import mongoose from "mongoose";
import Connection from "../models/Connections";
import Notification from "../models/Notification";
import notificationService from "../services/notificationService";
import connectionService from "../services/connectionService";

interface AuthRequest extends Request {
  userId?: string;
}

class ConnectionController {

  // create connection
  async createConnection(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { receiverId, message } = req.body;
      console.log("BODY RECEIVED:", req.body);

      if (!receiverId) {
        res.status(400).json({ message: "Receiver required" });
        return;
      }

      if (req.userId === receiverId) {
        res.status(400).json({ message: "Cannot connect with yourself" });
        return;
      }

      // checking existing connection both directions
      const existing = await Connection.findOne({
        $or: [
          { senderId: req.userId, receiverId },
          { senderId: receiverId, receiverId: req.userId }
        ]
      });

      if (existing) {
        res.status(400).json({ message: "Connection already exists" });
        return;
      }

      const connection = await Connection.create({
        senderId: req.userId,
        receiverId,
        message,
        status: "pending"

      });
      // create notification for receiver
      await notificationService.createNotification({
        userId: receiverId,
        actorId: req.userId,
        connectionId: connection._id.toString(),
        action: "request_sent"
      });

      res.status(201).json({
        success: true,
        connection
      });

      // const notification= await Notification.create({
      //   senderId: req.userId,

      //   message:"request sent "


      // })


    } catch (error: any) {
      console.log("CREATE CONNECTION ERROR FULL:", error);



      if (error.code === 11000) {
        res.status(400).json({ message: "Connection already exists" });
        return;
      }

      res.status(500).json({ message: error?.message || "Server error" });
    }
  }

  // get pending invitations
  async getInvitations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      console.log("Logged user:", req.userId);

      const invitations = await Connection.aggregate([
        {
          $match: {
            receiverId: new mongoose.Types.ObjectId(req.userId),
            status: "pending"
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
            message: 1,
            status: 1,
            createdAt: 1,
            senderName: "$senderProfile.name"
          }
        }
      ]);

      console.log("Invitations with sender:", invitations);

      res.status(200).json({
        success: true,
        invitations
      });

    } catch (error) {
      console.log("GET INVITATIONS ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //respond 
  async respondToInvitation(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { connectionId } = req.params;
      const { status } = req.body;

      // Validate status
      if (!["accepted", "rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      if (Array.isArray(connectionId)) {
        res.status(400).json({ message: "Invalid connectionId" });
        return;
      }
      const result = await connectionService.respondToInvitation({
        connectionId,
        userId: req.userId,
        status
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.log("RESPOND ERROR: ", error);
      res.status(400).json({ message: error.message });
    }
  }

  //get accepted connections

  async getAcceptedConnections(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const connections =
        await connectionService.getAcceptedConnections(req.userId);

      res.status(200).json({
        success: true,
        connections
      });

    } catch (error: any) {
      console.log("GET ACCEPTED CONNECTIONS ERROR:", error);
      res.status(500).json({
        message: error?.message || "Server error"
      });
    }
  }
}

export default new ConnectionController();