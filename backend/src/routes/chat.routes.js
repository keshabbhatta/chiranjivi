const express = require("express");

const router = express.Router();

const Conversation = require("../models/Conversation");

const Chat = require("../models/chat.model");


// CREATE CONVERSATION
router.post("/conversation", async (req, res) => {

  try {

    const { senderId, receiverId } = req.body;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {

      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    res.json(conversation);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET MESSAGES
router.get("/messages/:conversationId", async (req, res) => {

  try {

    const messages = await Chat.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "name");

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;