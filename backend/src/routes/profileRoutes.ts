import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";

import profileController from "../controllers/profileController";

const router: Router = express.Router();

router.post("/save", authMiddleware, profileController.saveProfile);
router.get("/me", authMiddleware, profileController.getProfile);
router.put("/update", authMiddleware, profileController.updateProfile);
router.get("/search", profileController.searchProfiles);

export default router;
