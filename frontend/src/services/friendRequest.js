import API from "./axios";

// Send friend request
export const sendFriendRequest = async (receiverId, message = "") => {
  try {
    const response = await API.post("/friend-request/send", {
      receiverId,
      message,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending requests (received by user)
export const getPendingRequests = async () => {
  try {
    const response = await API.get("/friend-request/pending");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get sent requests
export const getSentRequests = async () => {
  try {
    const response = await API.get("/friend-request/sent");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get accepted connections
export const getConnections = async () => {
  try {
    const response = await API.get("/friend-request/connections");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Accept friend request
export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await API.put(`/friend-request/accept/${requestId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reject friend request
export const rejectFriendRequest = async (requestId, reason = "") => {
  try {
    const response = await API.put(`/friend-request/reject/${requestId}`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cancel friend request
export const cancelFriendRequest = async (requestId) => {
  try {
    const response = await API.delete(
      `/friend-request/cancel/${requestId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
