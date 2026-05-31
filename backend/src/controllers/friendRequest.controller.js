const FriendRequest = require("../models/FriendRequest.model");
const User = require("../models/User.model");
const Conversation = require("../models/Conversation");

// SEND FRIEND REQUEST
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    // Check if user is trying to add themselves
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          existingRequest.status === "accepted"
            ? "You are already connected"
            : "Friend request already exists",
      });
    }

    // Create friend request
    const friendRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      message: message || "",
    });

    const populatedRequest = await friendRequest.populate([
      { path: "sender", select: "name email role avatar" },
      { path: "receiver", select: "name email role avatar" },
    ]);

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      friendRequest: populatedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send friend request",
    });
  }
};

// GET PENDING FRIEND REQUESTS
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name email role avatar specialization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

// GET SENT REQUESTS
const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "name email role avatar specialization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
    });
  }
};

// GET ACCEPTED CONNECTIONS
const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "accepted",
    })
      .populate("sender", "name email role avatar specialization")
      .populate("receiver", "name email role avatar specialization")
      .sort({ updatedAt: -1 });

    // Format connections data
    const connections = requests.map((req) => {
      const otherUser =
        req.sender._id.toString() === userId ? req.receiver : req.sender;
      return {
        friendRequestId: req._id,
        userId: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role,
        avatar: otherUser.avatar,
        specialization: otherUser.specialization,
        connectedAt: req.updatedAt,
      };
    });

    res.json({
      success: true,
      connections,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch connections",
    });
  }
};

// ACCEPT FRIEND REQUEST
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot accept this request",
      });
    }

    // Update request status
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Create conversation if it doesn't exist
    let conversation = await Conversation.findOne({
      participants: {
        $all: [friendRequest.sender, friendRequest.receiver],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [friendRequest.sender, friendRequest.receiver],
      });
    }

    const populatedRequest = await friendRequest.populate([
      { path: "sender", select: "name email role avatar" },
      { path: "receiver", select: "name email role avatar" },
    ]);

    res.json({
      success: true,
      message: "Friend request accepted",
      friendRequest: populatedRequest,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to accept friend request",
    });
  }
};

// REJECT FRIEND REQUEST
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot reject this request",
      });
    }

    // Update request status
    friendRequest.status = "rejected";
    friendRequest.rejectionReason = reason || "";
    await friendRequest.save();

    res.json({
      success: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to reject friend request",
    });
  }
};

// CANCEL FRIEND REQUEST
const cancelFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendRequest.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this request",
      });
    }

    await FriendRequest.deleteOne({ _id: requestId });

    res.json({
      success: true,
      message: "Friend request cancelled",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel friend request",
    });
  }
};

module.exports = {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  getConnections,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
};
