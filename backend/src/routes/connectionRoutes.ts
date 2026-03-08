import { Router } from "express";
import connectionController from "../controllers/connectionController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/createConnection", authMiddleware, connectionController.createConnection);
router.get("/getInvitations", authMiddleware, connectionController.getInvitations);
router.patch("/respondToInvitation/:connectionId", authMiddleware, connectionController.respondToInvitation);
router.get("/accepted", authMiddleware, connectionController.getAcceptedConnections);

export default router;
