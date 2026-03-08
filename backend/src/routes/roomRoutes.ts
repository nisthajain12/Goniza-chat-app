import { Router } from "express";
import roomController from "../controllers/roomController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/createRoom", authMiddleware, roomController.createRoom);
router.get("/myRooms", authMiddleware, roomController.getUserRooms);

export default router;