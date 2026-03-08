import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequestBody {
  email: string;
  password: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthController {

  async registerUser(
    req: Request<{}, {}, AuthRequestBody>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
      }

      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: user._id
      });

    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }

      res.status(500).json({ message: "Server error" });
    }
  }

  async loginUser(
    req: Request<{}, {}, AuthRequestBody>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
      }

      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        token,
        userId: user._id
      });

    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new AuthController();