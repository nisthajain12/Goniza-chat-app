const express = require("express");
const router = express.Router();
const { searchProfiles } = require("../controllers/profileController");


const authMiddleware = require("../middleware/authMiddleware");
const {
  saveProfile,
  getProfile,
  updateProfile
} = require("../controllers/profileController");

router.post("/save", authMiddleware, saveProfile);
router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.get("/search", searchProfiles);


module.exports = router;
