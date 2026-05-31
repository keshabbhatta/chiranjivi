const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique pending/accepted requests between two users
friendRequestSchema.index(
  { sender: 1, receiver: 1, status: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
