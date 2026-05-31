# Two-Way Communication with Friend Requests - Implementation Guide

## Overview
This document describes the implementation of a two-way communication system in Chiranjivi where patients can send friend requests to doctors and initiate real-time chat upon acceptance.

## Architecture

### Backend Structure

#### 1. **New Model: FriendRequest** (`backend/src/models/FriendRequest.model.js`)
- Stores friend request data between users
- Fields:
  - `sender`: User ID of the requester (patient)
  - `receiver`: User ID of the recipient (doctor)
  - `status`: "pending", "accepted", or "rejected"
  - `message`: Optional message with the request
  - `rejectionReason`: Reason for rejection
  - `timestamps`: Created and updated dates

#### 2. **Controller: Friend Request Controller** (`backend/src/controllers/friendRequest.controller.js`)
Key functions:
- `sendFriendRequest()`: Patient sends request to doctor
- `getPendingRequests()`: Doctor views pending requests
- `getSentRequests()`: Patient views sent requests
- `getConnections()`: Get list of accepted connections
- `acceptFriendRequest()`: Doctor accepts request (creates conversation)
- `rejectFriendRequest()`: Doctor rejects request
- `cancelFriendRequest()`: Patient cancels pending request

#### 3. **Routes: Friend Request Routes** (`backend/src/routes/friendRequest.routes.js`)
```
POST   /api/friend-request/send           - Send request
GET    /api/friend-request/pending        - Get pending requests
GET    /api/friend-request/sent           - Get sent requests
GET    /api/friend-request/connections    - Get accepted connections
PUT    /api/friend-request/accept/:id     - Accept request
PUT    /api/friend-request/reject/:id     - Reject request
DELETE /api/friend-request/cancel/:id     - Cancel request
```

#### 4. **Socket Events** (`backend/src/config/socket.js`)
New events:
- `sendFriendRequest`: Notify receiver of new request
- `acceptFriendRequest`: Notify sender of acceptance
- `rejectFriendRequest`: Notify sender of rejection

### Frontend Structure

#### 1. **Service: Friend Request Service** (`frontend/src/services/friendRequest.js`)
- API calls for all friend request operations
- Uses axios with authentication interceptor

#### 2. **Components**

**FriendRequests.jsx** - Doctor's pending requests view
- Displays incoming requests
- Accept/Reject buttons
- Listens to real-time socket events

**SendFriendRequest.jsx** - Patient's request form
- Form to send friend request with optional message
- Shows pending status
- Cancel functionality

**ConnectionsList.jsx** - Active connections list
- Shows accepted friends
- Online/offline status
- Click to start chat

#### 3. **Pages**

**Chat.jsx** - Main chat interface
- Integrates FriendRequests and ConnectionsList
- Shows tabs for Connections and Requests (doctors only)
- Real-time messaging interface
- Message history loading

**FindDoctorAdvanced.jsx** - Doctor discovery
- Search doctors by name, specialization, hospital
- Browse doctor profiles
- Send friend requests from profile
- View available slots

## User Flow

### For Patients:
1. Navigate to "Find Doctors" page
2. Search for doctors by specialization/name
3. Click doctor profile → "Send Friend Request"
4. Optional: Add a message with the request
5. Wait for doctor acceptance
6. Once accepted, doctor appears in "Active Connections"
7. Click connection to start real-time chat

### For Doctors:
1. Go to Chat section → "Requests" tab
2. View pending friend requests from patients
3. Accept/Reject requests
4. Accepted patients appear in "Active Connections"
5. Click connection to open chat

## Real-Time Features

- **Socket.io Events**:
  - Patient sends request → Doctor receives instant notification
  - Doctor accepts → Patient sees connection immediately
  - Doctor rejects → Patient is notified
  - Messages sync in real-time between connected users
  - Typing indicators
  - Online/offline status

## Key Features

1. **Request Management**:
   - Prevent duplicate requests
   - Prevent self-requests
   - One-way pending requests (can't have both ways)

2. **Conversation Auto-Creation**:
   - When doctor accepts request, conversation is automatically created
   - Prevents chat without proper connection

3. **Real-Time Updates**:
   - Socket.io for instant notifications
   - Status changes reflect immediately

4. **Security**:
   - Auth middleware protects all routes
   - Users can only manage their own requests
   - Doctors can only accept/reject received requests

## Integration Points

### Update Main App Route:
Add to your main App.js or routing file:
```javascript
import FindDoctorAdvanced from "./pages/FindDoctorAdvanced";

// In Routes:
<Route path="/find-doctors" element={<FindDoctorAdvanced />} />
<Route path="/chat" element={<Chat />} />
```

### Update Redux Store (if needed):
The implementation uses Redux for current user state:
```javascript
const currentUser = useSelector((state) => state.user.user);
```

## Database Indexes

The FriendRequest model includes a compound index:
```
{ sender: 1, receiver: 1, status: 1 }
```
This ensures uniqueness for pending/accepted requests between two users.

## API Response Examples

### Send Friend Request:
```json
{
  "success": true,
  "message": "Friend request sent successfully",
  "friendRequest": {
    "_id": "...",
    "sender": { "name": "John", "role": "patient" },
    "receiver": { "name": "Dr. Smith", "role": "doctor" },
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Connections:
```json
{
  "success": true,
  "connections": [
    {
      "userId": "...",
      "name": "Dr. Smith",
      "role": "doctor",
      "specialization": "Cardiology",
      "avatar": "url",
      "connectedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

## Testing the Implementation

1. **Create two test accounts**:
   - Patient account
   - Doctor account

2. **Test patient flow**:
   - Login as patient
   - Go to Find Doctors page
   - Search and find your test doctor
   - Send friend request
   - Check "Pending Requests" appear

3. **Test doctor flow**:
   - Login as doctor
   - Go to Chat → Requests tab
   - See pending request from patient
   - Accept request
   - Should appear in connections

4. **Test messaging**:
   - Both users should see conversation in connections
   - Send messages and verify real-time delivery
   - Check typing indicators
   - Verify message history loads

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Request not appearing | Check auth middleware and user role |
| Chat not loading | Verify conversation creation on acceptance |
| Messages not real-time | Ensure Socket.io is connected (check browser console) |
| Cannot send request | Might already have pending/accepted request |

## Future Enhancements

1. Request expiration (auto-expire after 30 days)
2. Recommendation system (suggest doctors to patients)
3. Rating/review system
4. Consultation scheduling with payments
5. File sharing in chat (images, documents)
6. Voice/video call integration
7. Chat groups/team consultations
8. Message encryption

## Files Created/Modified

### Created:
- `backend/src/models/FriendRequest.model.js`
- `backend/src/controllers/friendRequest.controller.js`
- `backend/src/routes/friendRequest.routes.js`
- `frontend/src/services/friendRequest.js`
- `frontend/src/components/FriendRequests.jsx`
- `frontend/src/components/SendFriendRequest.jsx`
- `frontend/src/components/ConnectionsList.jsx`
- `frontend/src/pages/FindDoctorAdvanced.jsx`

### Modified:
- `backend/src/index.js` (added friend request routes)
- `backend/src/config/socket.js` (added friend request events)
- `frontend/src/pages/Chat.jsx` (updated with new UI)

## Conclusion
The implementation provides a complete two-way communication system with friend requests, real-time notifications, and secure messaging between patients and doctors.
