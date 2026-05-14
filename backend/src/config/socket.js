import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const onlineUsers = [];

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("Socket Connected");

    // USER ONLINE
    socket.on("join", (userId) => {

      socket.userId = userId;

      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }

      io.emit("onlineUsers", onlineUsers);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (data) => {

      try {

        const newMessage =
          await Message.create({
            conversationId:
              data.conversationId,

            sender: socket.userId,

            content: data.content,

            type: data.type,

            imageUrl: data.imageUrl,
          });

        const populatedMessage =
          await Message.findById(
            newMessage._id
          ).populate(
            "sender",
            "name avatar"
          );

        await Conversation.findByIdAndUpdate(
          data.conversationId,
          {
            lastMessage: newMessage._id,
            updatedAt: new Date(),
          }
        );

        io.emit(
          "newMessage",
          populatedMessage
        );

      } catch (error) {
        console.log(error);
      }
    });

    // TYPING
    socket.on("typing", (data) => {

      socket.broadcast.emit(
        "typing",
        data
      );
    });

    // DISCONNECT
    socket.on("disconnect", () => {

      const index =
        onlineUsers.indexOf(socket.userId);

      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }

      io.emit("onlineUsers", onlineUsers);

      console.log("Socket Disconnected");
    });
  });
};

export default socketHandler;