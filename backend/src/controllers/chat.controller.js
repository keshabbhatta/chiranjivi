const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


// GET CONVERSATIONS
const getConversations = async (
  req,
  res
) => {

  try {

    const conversations =
      await Conversation.find({
        participants: req.user.id,
      })
        .populate(
          "participants",
          "name email role avatar"
        )
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};


// GET MESSAGES
const getMessages = async (
  req,
  res
) => {

  try {

    const messages =
      await Message.find({
        conversationId:
          req.params.conversationId,
      })
        .populate(
          "sender",
          "name avatar role"
        )
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


module.exports = {
  getConversations,
  getMessages,
};