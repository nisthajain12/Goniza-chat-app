const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
require("dotenv").config();

const app = express();

// --------------------
// HTTP + SOCKET SETUP
// --------------------
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Store online users (userId -> socketId)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // USER COMES ONLINE
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User joined:", userId);
  });

  // SEND MESSAGE (1-1)
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log("Message:", senderId, "->", receiverId);

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message
      });
    }
  });

  // USER DISCONNECTS
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES
// --------------------
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const connectionRoutes = require("./routes/connectionRoutes")

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connection", connectionRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Goniza Backend Running 🚀");
});

// --------------------
// DB + SERVER START
// --------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    httpServer.listen(PORT, () => {
      console.log(`Server + Socket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
