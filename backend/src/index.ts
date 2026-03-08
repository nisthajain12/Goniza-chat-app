import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import connectionRoutes from "./routes/connectionRoutes";
import roomRoutes from "./routes/roomRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import messageRoutes from "./routes/messageRoutes";

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (_, res) => {
  res.send("Goniza Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// create HTTP server
const httpServer = createServer(app);

// socket server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

// start server AFTER db connects
const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("MongoDB connection failed", error);
    process.exit(1);

  }
};

startServer();

export { io };