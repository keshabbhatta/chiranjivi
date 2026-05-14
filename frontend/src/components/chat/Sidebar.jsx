import React from "react";

const Sidebar = ({ conversations, setSelectedChat }) => {
  return (
    <div className="w-[30%] bg-[#111827] border-r border-gray-700 overflow-y-auto">
      <div className="p-4 text-3xl font-bold text-violet-500">
        Chiranjivi Chat
      </div>

      {conversations.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          className="p-4 border-b border-gray-700 hover:bg-[#1f2937] cursor-pointer"
        >
          <h2 className="text-white font-semibold">
            {chat.name || "Unknown User"}
          </h2>

          <p className="text-gray-400 text-sm">
            {chat.lastMessage || "Start chatting"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;