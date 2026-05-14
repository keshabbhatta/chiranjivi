const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      conversationId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

      seenBy: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      deliveredTo: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      isEdited: {
        type: Boolean,
        default: false,
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.Message ||
  mongoose.model(
    "Message",
    messageSchema
  );