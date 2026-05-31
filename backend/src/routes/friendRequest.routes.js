const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  getConnections,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
} = require("../controllers/friendRequest.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected routes
router.use(protect);

// Send friend request
router.post("/send", sendFriendRequest);

// Get pending requests (received by user)
router.get("/pending", getPendingRequests);

// Get sent requests
router.get("/sent", getSentRequests);

// Get accepted connections
router.get("/connections", getConnections);

// Accept friend request
router.put("/accept/:requestId", acceptFriendRequest);

// Reject friend request
router.put("/reject/:requestId", rejectFriendRequest);

// Cancel friend request
router.delete("/cancel/:requestId", cancelFriendRequest);

module.exports = router;
