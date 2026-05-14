import React, { useState } from "react";

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-700 flex gap-3 bg-[#111827]">
      <input
        type="text"
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-gray-800 text-white p-3 rounded-xl outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-violet-600 px-6 rounded-xl text-white"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;