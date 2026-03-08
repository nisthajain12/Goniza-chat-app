import { Router } from "express";
import notificationController from "../controllers/notificationController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

export default router;