const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const {
  createConnection,
  getInvitations
} = require("../controllers/connectionController");

router.post("/createConnection", authMiddleware, createConnection);
router.get("/getInvitations", authMiddleware, getInvitations);
// router.get("/", authMiddleware, getProfile);
// router.put("/update", authMiddleware, updateProfile);



module.exports = router;
