import { Request, Response } from "express";
import notificationService from "../services/notificationService";

interface AuthRequest extends Request {
  userId?: string;
}

class NotificationController {

  async getNotifications(req: AuthRequest, res: Response) {

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const notifications =
    await notificationService.getUserNotifications(req.userId);

  console.log("NOTIFICATIONS FROM DB:");
  console.log(JSON.stringify(notifications, null, 2));

  res.json({
    success: true,
    notifications
  });
}

}

export default new NotificationController();