const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Chat",
  chatSchema
);