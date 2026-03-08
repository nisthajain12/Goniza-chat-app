import { Request, Response } from "express";
import messageService from "../services/messageService";
import { io } from "../index";
import Profile from "../models/Profile";

interface AuthRequest extends Request {
  userId?: string;
}

class MessageController {

  async sendMessage(req: AuthRequest, res: Response) {

    try {

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { roomId, body, attachments } = req.body;

      const message = await messageService.createMessage({
        senderId: req.userId,
        roomId,
        body,
        attachments
      });

      const senderProfile = await Profile.findOne({ user: req.userId });

      const formattedMessage = {
        ...message.toObject(),
        senderName: senderProfile?.name
      };

      io.to(roomId).emit("receive_message", formattedMessage);

      res.status(201).json({
        success: true,
        message: formattedMessage
      });
      

    } catch (error) {

      console.log("SEND MESSAGE ERROR:", error);

      res.status(500).json({
        message: "Server error"
      });

    }

  }

  async getRoomMessages(req: AuthRequest, res: Response) {

    try {

      const { roomId } = req.params;

      if (!roomId || Array.isArray(roomId)) {
        return res.status(400).json({
          message: "Invalid roomId"
        });
      }

      const messages =
        await messageService.getRoomMessages(roomId);

      res.json({
        success: true,
        messages
      });

    } catch (error) {

      console.log("GET ROOM MESSAGES ERROR:", error);

      res.status(500).json({
        message: "Server error"
      });

    }

  }
}

export default new MessageController();