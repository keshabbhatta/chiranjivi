import React, { useState, useEffect } from "react";
import { getConnections } from "../services/friendRequest";
import socket from "../socket/socket";

const ConnectionsList = ({ currentUserId, onSelectConnection }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    fetchConnections();

    // Listen for online users
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await getConnections();
      if (response.success) {
        setConnections(response.connections);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading connections...</p>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          No connections yet. Send friend requests to doctors to start
          chatting!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Active Connections ({connections.length})
      </h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {connections.map((connection) => {
          const isOnline = onlineUsers.includes(
            connection.userId
          );

          return (
            <button
              key={connection.userId}
              onClick={() => onSelectConnection(connection)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className="relative">
                  <img
                    src={
                      connection.avatar ||
                      "https://via.placeholder.com/40"
                    }
                    alt={connection.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      isOnline
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {connection.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {connection.role === "doctor"
                      ? "Doctor"
                      : "Patient"}
                    {connection.specialization &&
                      ` • ${connection.specialization}`}
                  </p>
                </div>
              </div>

              {isOnline && (
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                  Online
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={fetchConnections}
        className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
      >
        Refresh
      </button>
    </div>
  );
};

export default ConnectionsList;
