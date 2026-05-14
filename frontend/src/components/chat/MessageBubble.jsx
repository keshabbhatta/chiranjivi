import React from "react";

const MessageBubble = ({ msg, own }) => {
  return (
    <div
      className={`flex mb-3 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-[60%] ${
          own
            ? "bg-violet-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default MessageBubble;