require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const labReportRoutes = require("./routes/labReport.routes");
const chatRoutes = require("./routes/chat.routes");

const Chat = require("./models/chat.model");
const Conversation = require("./models/Conversation");

const app = express();
const PORT = process.env.PORT || 5000;

// DATABASE
connectDB();

// MIDDLEWARE
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/diet", require("./routes/diet.routes"));
app.use("/api/image", require("./routes/image.routes"));

// GEMINI API (For Lab Reports)
app.post("/api/analyze", async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;
    if (!base64Image || !mimeType) {
      return res.status(400).json({ message: "Image data required" });
    }

    const promptText = `
      Analyze this medical report. Return ONLY valid JSON:
      {
        "overallStatus":"Normal",
        "overallSummary":"summary",
        "keyFindings":["finding"],
        "recommendations":["advice"]
      }
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              { inline_data: { mime_type: mimeType, data: base64Image } },
            ],
          },
        ],
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    res.json(JSON.parse(cleanJson));

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gemini analysis failed" });
  }
});

// SERVER & SOCKET
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("🟢 User Connected");

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    if (!onlineUsers.includes(userId)) onlineUsers.push(userId);
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = await Chat.create({
        conversationId: data.conversationId,
        sender: data.sender,
        content: data.content,
      });
      const populatedMessage = await Chat.findById(newMessage._id).populate("sender", "name");
      await Conversation.findByIdAndUpdate(data.conversationId, { lastMessage: newMessage._id, lastActivity: new Date() });

      io.to(data.receiver).emit("receiveMessage", populatedMessage);
      io.to(data.sender).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("typing", (data) => socket.to(data.receiver).emit("typing", data));
  socket.on("seen", async ({ messageId }) => {
    try {
      await Chat.findByIdAndUpdate(messageId, { seen: true });
      io.emit("messageSeen", { messageId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((id) => id !== socket.userId);
    io.emit("onlineUsers", onlineUsers);
    console.log("🔴 User Disconnected");
  });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});
app.use(errorHandler);

// START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});