import React, { useState, useEffect } from "react";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
} from "../services/friendRequest";
import socket from "../socket/socket";

const FriendRequests = ({ currentUserId, onRequestAccepted }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();

    // Listen for incoming friend requests
    socket.on("friendRequestReceived", (newRequest) => {
      setRequests((prev) => [newRequest, ...prev]);
    });

    return () => {
      socket.off("friendRequestReceived");
    };
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await getPendingRequests();
      if (response.success) {
        setRequests(response.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, senderId) => {
    try {
      setAcceptingId(requestId);
      const response = await acceptFriendRequest(requestId);

      if (response.success) {
        setRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );

        // Notify sender through socket
        socket.emit("acceptFriendRequest", {
          requestId,
          senderId,
        });

        // Call callback to update parent component
        if (onRequestAccepted) {
          onRequestAccepted(response.friendRequest, response.conversationId);
        }

        alert("Request accepted! You can now chat.");
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept request");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (requestId, senderId) => {
    try {
      setRejectingId(requestId);
      const reason = prompt("Reason for rejection (optional):", "");

      const response = await rejectFriendRequest(requestId, reason);

      if (response.success) {
        setRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );

        // Notify sender through socket
        socket.emit("rejectFriendRequest", {
          requestId,
          senderId,
          reason,
        });

        alert("Request rejected");
      }
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject request");
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Friend Requests ({requests.length})
      </h2>

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <img
                src={
                  request.sender?.avatar ||
                  "https://via.placeholder.com/40"
                }
                alt={request.sender?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {request.sender?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {request.sender?.role === "doctor"
                    ? "Doctor"
                    : "Patient"}
                </p>
                {request.sender?.specialization && (
                  <p className="text-xs text-blue-600">
                    {request.sender.specialization}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleAccept(
                    request._id,
                    request.sender._id
                  )
                }
                disabled={acceptingId === request._id}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition text-sm"
              >
                {acceptingId === request._id
                  ? "Accepting..."
                  : "Accept"}
              </button>
              <button
                onClick={() =>
                  handleReject(
                    request._id,
                    request.sender._id
                  )
                }
                disabled={rejectingId === request._id}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition text-sm"
              >
                {rejectingId === request._id
                  ? "Rejecting..."
                  : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
