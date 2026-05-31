import React, {
  useEffect,
  useState,
} from "react";

import socket from "../socket/socket";

const ChatBox = ({
  currentUserId,
  otherUserId,
  conversationId,
  role,
}) => {

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  // JOIN
  useEffect(() => {

    socket.emit(
      "join",
      currentUserId
    );

  }, [currentUserId]);

  // RECEIVE
  useEffect(() => {

    const messageHandler =
    (message) => {

      console.log(
        "MESSAGE:",
        message
      );

      setMessages((prev) => [

        ...prev,

        {
          sender:
            message.sender?._id ===
            currentUserId
              ? "me"
              : "them",

          text:
            message.content,
        },

      ]);

    };

    socket.on(
      "receiveMessage",
      messageHandler
    );

    return () => {

      socket.off(
        "receiveMessage",
        messageHandler
      );

    };

  }, [currentUserId]);

  // SEND
  const sendMessage = () => {

    if (!text.trim()) return;

    socket.emit(
      "sendMessage",

      {
        conversationId,

        sender:
        currentUserId,

        receiver:
        otherUserId,

        content: text,
      }

    );

    setText("");

  };

  return (

    <div className="
      h-screen
      bg-black
      text-white
      flex
      flex-col
    ">

      {/* HEADER */}

      <div className={`
        p-5
        text-3xl
        font-bold

        ${
          role === "doctor"
            ? "bg-violet-700"
            : "bg-blue-700"
        }
      `}>

        {
          role === "doctor"
            ? "Doctor Chat"
            : "Patient Chat"
        }

      </div>

      {/* MESSAGES */}

      <div className="
        flex-1
        overflow-y-auto
        p-5
      ">

        {
          messages.map(
            (msg, index) => (

            <div
              key={index}

              className={`
                mb-4

                ${
                  msg.sender === "me"
                    ? "text-right"
                    : "text-left"
                }
              `}
            >

              <div className="
                inline-block
                bg-gray-800
                px-5
                py-3
                rounded-2xl
              ">

                {msg.text}

              </div>

            </div>

          ))
        }

      </div>

      {/* INPUT */}

      <div className="
        p-5
        flex
        gap-3
      ">

        <input
          type="text"

          value={text}

          onChange={(e) =>
            setText(
              e.target.value
            )
          }

          className="
            flex-1
            bg-gray-800
            p-4
            rounded-xl
          "
        />

        <button
          onClick={sendMessage}

          className={`
            px-8
            rounded-xl

            ${
              role === "doctor"
                ? "bg-violet-600"
                : "bg-blue-600"
            }
          `}
        >
          Send
        </button>

      </div>

    </div>

  );

};

export default ChatBox;