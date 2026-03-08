import { Router} from "express"
import authController from "../controllers/authController";

const router: Router = Router();

// Signup
router.post("/register", authController.registerUser);

// Login
router.post("/login", authController.loginUser);

export default router;
