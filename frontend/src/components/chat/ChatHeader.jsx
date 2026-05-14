import React from "react";

const ChatHeader = ({ selectedChat }) => {
  return (
    <div className="h-20 border-b border-gray-700 flex items-center px-6 bg-[#111827]">
      <h1 className="text-white text-2xl font-bold">
        {selectedChat?.name || "Select Chat"}
      </h1>
    </div>
  );
};

export default ChatHeader;