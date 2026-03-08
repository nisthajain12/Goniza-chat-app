import { Router } from "express";
import messageController from "../controllers/messageController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/send",
  authMiddleware,
  messageController.sendMessage
);

router.get(
  "/room/:roomId",
  authMiddleware,
  messageController.getRoomMessages
);

export default router;