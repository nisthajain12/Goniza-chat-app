import { Request, Response } from "express";
import Profile from "../models/Profile";

interface AuthRequest extends Request {
  userId?: string;
}

class ProfileController {

  async saveProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const existingProfile = await Profile.findOne({ user: req.userId });

      if (existingProfile) {
        res.status(400).json({ message: "Profile already exists" });
        return;
      }

      const profile = await Profile.create({
        user: req.userId,
        ...req.body
      });

      res.status(201).json({
        success: true,
        profile
      });

    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const profile = await Profile.findOne({ user: req.userId });

      if (!profile) {
        res.status(200).json({
          profile: null,
          profileComplete: false
        });
        return;
      }

      res.status(200).json({
        profile,
        profileComplete: true
      });

    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.userId },
        { ...req.body },
        { new: true }
      );

      if (!updatedProfile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }

      res.status(200).json({
        success: true,
        profile: updatedProfile
      });

    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }

  async searchProfiles(req: Request, res: Response): Promise<void> {
  try {
    const searchQuery = req.query.query as string;

    if (!searchQuery) {
      res.status(400).json({ message: "Search query required" });
      return;
    }

    const profiles = await Profile.find({
      name: { $regex: searchQuery, $options: "i" }
    })
      .select("name photo user")
      .lean();

    res.status(200).json(profiles);

  } catch (error: any) {
    console.log("SEARCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}
}

export default new ProfileController();