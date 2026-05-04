const asyncHandler = require("express-async-handler");
const OpenAI       = require("openai");
const Chat         = require("../models/Chat.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable healthcare AI assistant. 
You help users with general health questions, understanding symptoms, medication information, 
healthy lifestyle tips, and navigating healthcare. 
Always remind users to consult a qualified doctor for medical advice.
Keep responses clear, empathetic, and concise.`;

// ── POST /api/chat/message ────────────────────────────────
const sendMessage = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  if (!message?.trim()) {
    res.status(400);
    throw new Error("Message cannot be empty");
  }

  let chat;

  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: req.user._id, isActive: true });
    if (!chat) { res.status(404); throw new Error("Chat not found"); }
  } else {
    // new chat — use first few words as title
    const title = message.length > 40 ? message.substring(0, 40) + "..." : message;
    chat = await Chat.create({ user: req.user._id, title, messages: [] });
  }

  // Add user message
  chat.messages.push({ role: "user", content: message });

  // Build messages array for OpenAI (limit to last 20 for token efficiency)
  const historyMessages = chat.messages.slice(-20).map((m) => ({
    role:    m.role,
    content: m.content,
  }));

  const completion = await openai.chat.completions.create({
    model:       "gpt-4o-mini",
    messages:    [{ role: "system", content: SYSTEM_PROMPT }, ...historyMessages],
    max_tokens:  500,
    temperature: 0.7,
  });

  const aiReply = completion.choices[0]?.message?.content?.trim();

  // Save AI reply
  chat.messages.push({ role: "assistant", content: aiReply });
  await chat.save();

  res.json({
    success:  true,
    chatId:   chat._id,
    message:  aiReply,
    history:  chat.messages.slice(-10),
  });
});

// ── GET /api/chat ─────────────────────────────────────────
const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id, isActive: true })
    .select("title createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .limit(20);

  res.json({ success: true, data: chats });
});

// ── GET /api/chat/:id ─────────────────────────────────────
const getChatById = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) { res.status(404); throw new Error("Chat not found"); }
  res.json({ success: true, data: chat });
});

// ── DELETE /api/chat/:id ──────────────────────────────────
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isActive: false },
    { new: true }
  );
  if (!chat) { res.status(404); throw new Error("Chat not found"); }
  res.json({ success: true, message: "Chat deleted" });
});

module.exports = { sendMessage, getChats, getChatById, deleteChat };
