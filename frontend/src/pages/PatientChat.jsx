import React, {
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const patientId =
  "6a02da132a848136b2199add";

const doctorId =
  "6a02d9fd2a848136b2199adb";

const conversationId =
  "6a02ee7270a3ba2966975745";

const PatientChat = () => {

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  useEffect(() => {

    socket.emit("join", patientId);

  }, []);

  useEffect(() => {

    socket.on(
      "receiveMessage",
      (message) => {

        setMessages((prev) => [
          ...prev,
          {
            sender:
              message.sender === patientId
                ? "me"
                : "them",

            text: message.content,
          },
        ]);
      }
    );

    return () => {
      socket.off("receiveMessage");
    };

  }, []);

  const sendMessage = () => {

    socket.emit("sendMessage", {

      conversationId,

      sender: patientId,

      receiver: doctorId,

      content: text,
    });

    setText("");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      <div className="p-5 bg-blue-700 text-3xl font-bold">
        Patient Dashboard
      </div>

      <div className="flex-1 p-5 overflow-y-auto">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "me"
                ? "text-right"
                : "text-left"
            }`}
          >

            <div className="inline-block bg-gray-800 px-5 py-3 rounded-2xl">
              {msg.text}
            </div>

          </div>
        ))}
      </div>

      <div className="p-5 flex gap-3">

        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          className="flex-1 bg-gray-800 p-4 rounded-xl"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-8 rounded-xl"
        >
          Send
        </button>

      </div>
    </div>
  );
};

export default PatientChat;