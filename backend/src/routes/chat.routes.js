const express = require("express");
const router  = express.Router();
const { sendMessage, getChats, getChatById, deleteChat } = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get(   "/",        getChats);
router.post(  "/message", sendMessage);
router.get(   "/:id",     getChatById);
router.delete("/:id",     deleteChat);

module.exports = router;
