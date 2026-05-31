import React, { useState } from "react";
import {
  sendFriendRequest,
  cancelFriendRequest,
} from "../services/friendRequest";
import socket from "../socket/socket";

const SendFriendRequest = ({
  doctorId,
  doctorName,
  doctorAvatar,
  doctorSpecialization,
  currentUserId,
  onRequestSent,
  isPending = false,
  requestId = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSendRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await sendFriendRequest(doctorId, message);

      if (response.success) {
        // Notify doctor through socket
        socket.emit("sendFriendRequest", {
          requestId: response.friendRequest._id,
          receiver: doctorId,
          sender: currentUserId,
        });

        alert("Friend request sent successfully!");
        setMessage("");
        setShowForm(false);

        if (onRequestSent) {
          onRequestSent(response.friendRequest);
        }
      }
    } catch (error) {
      console.error("Failed to send request:", error);
      alert(error?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!requestId) return;

    try {
      setIsCancelling(true);
      const response = await cancelFriendRequest(requestId);

      if (response.success) {
        alert("Request cancelled");
        if (onRequestSent) {
          onRequestSent(null);
        }
      }
    } catch (error) {
      console.error("Failed to cancel request:", error);
      alert("Failed to cancel request");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Doctor Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={doctorAvatar || "https://via.placeholder.com/60"}
            alt={doctorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {doctorName}
            </h3>
            {doctorSpecialization && (
              <p className="text-sm text-blue-600">
                {doctorSpecialization}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Request Status */}
      {isPending && requestId ? (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Request Pending
            </p>
            <p className="text-xs text-yellow-700">
              Waiting for acceptance...
            </p>
          </div>
          <button
            onClick={handleCancelRequest}
            disabled={isCancelling}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition text-sm"
          >
            {isCancelling ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      ) : (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Send Friend Request
            </button>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi Dr., I would like to consult with you..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setMessage("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default SendFriendRequest;
