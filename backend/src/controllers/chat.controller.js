const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User.model");


// GET CONVERSATIONS
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name email role avatar doctorUsername isOnline")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ lastActivity: -1 });

    // Format response to show other participant details
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== req.user.id
      );

      return {
        _id: conv._id,
        otherUser: otherParticipant,
        lastMessage: conv.lastMessage,
        lastActivity: conv.lastActivity,
        createdAt: conv.createdAt,
      };
    });

    res.json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};


// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("sender", "name avatar role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};


// CREATE OR GET CONVERSATION
const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    // Validate that both users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("participants", "name email role avatar doctorUsername isOnline");

    // Create conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name email role avatar doctorUsername isOnline"
      );
    }

    // Format response to show other participant
    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== senderId
    );

    res.json({
      success: true,
      conversation: {
        _id: conversation._id,
        otherUser: otherParticipant,
        participants: conversation.participants,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create or get conversation",
    });
  }
};


// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type, imageUrl } = req.body;
    const senderId = req.user.id;

    if (!content && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      content: content || "",
      type: type || "text",
      imageUrl: imageUrl || "",
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name avatar role"
    );

    // Update conversation lastMessage and lastActivity
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastActivity: new Date(),
    });

    res.json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};


module.exports = {
  getConversations,
  getMessages,
  createOrGetConversation,
  sendMessage,
};