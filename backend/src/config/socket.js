const { Server } = require("socket.io");

const Chat = require("../models/chat.model");
const Conversation = require("../models/Conversation");

let onlineUsers = [];
let userSocketMap = {}; // Map userId to socketId for real-time updates

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("🟢 User Connected");

    // ======================
    // JOIN
    // ======================
    socket.on("join", (userId) => {
      socket.userId = userId;
      userSocketMap[userId] = socket.id;

      socket.join(userId);

      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }

      io.emit("onlineUsers", onlineUsers);
      io.emit("doctorStatusUpdate", { userId, isOnline: true });

      console.log("✅ User Joined:", userId);
    });

    // ======================
    // SEND MESSAGE
    // ======================
    socket.on("sendMessage", async (data) => {
      try {
        console.log("📩 Incoming:", data);

        const newMessage = await Chat.create({
          conversationId: data.conversationId,
          sender: data.sender,
          content: data.content,
        });

        const populatedMessage =
          await Chat.findById(newMessage._id).populate(
            "sender",
            "name"
          );

        await Conversation.findByIdAndUpdate(
          data.conversationId,
          {
            lastMessage: newMessage._id,
            lastActivity: new Date(),
          }
        );

        io.to(data.receiver).emit(
          "receiveMessage",
          populatedMessage
        );

        io.to(data.sender).emit(
          "receiveMessage",
          populatedMessage
        );

        console.log("✅ Message Sent");
      } catch (error) {
        console.log("❌ Socket Error:", error);
      }
    });

    // ======================
    // TYPING
    // ======================
    socket.on("typing", (data) => {
      socket
        .to(data.receiver)
        .emit("typing", data);
    });

    // ======================
    // MESSAGE SEEN
    // ======================
    socket.on("seen", async ({ messageId }) => {
      try {
        await Chat.findByIdAndUpdate(messageId, {
          seen: true,
        });

        io.emit("messageSeen", {
          messageId,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // ======================
    // DISCONNECT
    // ======================
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(
        (id) => id !== socket.userId
      );

      delete userSocketMap[socket.userId];

      io.emit("onlineUsers", onlineUsers);
      io.emit("doctorStatusUpdate", { userId: socket.userId, isOnline: false });

      console.log("🔴 User Disconnected");
    });
  });
};

module.exports = initializeSocket;