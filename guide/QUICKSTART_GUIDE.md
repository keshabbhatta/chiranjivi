# Quick Start Guide - Two-Way Chat with Friend Requests

## Backend Setup

1. **Start MongoDB** (if not already running)
   ```bash
   # Windows
   mongod
   ```

2. **Install dependencies** (if not done):
   ```bash
   cd backend
   npm install
   ```

3. **Start backend server**:
   ```bash
   npm start
   # Or: node src/index.js
   ```
   Expected output: `🚀 Chiranjivi Backend Running`

## Frontend Setup

1. **Install dependencies** (if not done):
   ```bash
   cd frontend
   npm install
   ```

2. **Start React development server**:
   ```bash
   npm start
   ```
   Browser will open at `http://localhost:3000`

## Testing the Feature

### Step 1: Create Test Accounts
1. Open the app in two browser windows/tabs
2. **Window 1**: Sign up as a Patient
   - Email: patient@test.com
   - Name: John Patient
   - Role: Patient

3. **Window 2**: Sign up as a Doctor
   - Email: doctor@test.com
   - Name: Dr. Smith
   - Specialization: Cardiology

### Step 2: Patient Sends Friend Request
In Window 1 (Patient):
1. Navigate to `/find-doctors` route or "Find Doctors" page
2. You should see Dr. Smith in the list
3. Click on doctor card → "Send Friend Request"
4. (Optional) Add message: "Hi doctor, I need consultation"
5. Click "Send Request"
6. You'll see "Request Pending" status

### Step 3: Doctor Accepts Request
In Window 2 (Doctor):
1. Go to Chat page
2. Click "Requests" tab
3. You'll see John Patient's request
4. Click "Accept" button
5. Doctor is now connected!

### Step 4: Real-Time Chat
In Window 1 (Patient):
1. Go to Chat page
2. Under "Chats" tab, you'll see Dr. Smith in connections
3. Click Dr. Smith to open chat
4. Type a message: "When can I book an appointment?"
5. Press Enter or click Send

In Window 2 (Doctor):
1. Under "Chats" tab, you'll see John Patient
2. Click to open chat
3. You'll see the message in real-time!
4. Reply: "Available Monday at 10 AM"
5. See message appear in patient's chat

## Routes to Use

```
Patient Pages:
- /find-doctors              → Browse and send requests
- /chat                      → View connections and messages

Doctor Pages:
- /chat                      → View requests and connections
```

## Feature Overview

### Patient Features:
✅ Browse doctors by specialization/name/hospital
✅ Send friend requests with optional message
✅ View sent pending requests
✅ Cancel pending requests
✅ View accepted connections
✅ Real-time messaging with doctors
✅ Typing indicators
✅ Online status

### Doctor Features:
✅ View pending friend requests from patients
✅ Accept/Reject requests with optional reason
✅ View all accepted connections (patients)
✅ Real-time messaging with patients
✅ Typing indicators
✅ Online status

## Socket Events in Console

Open browser DevTools → Console to see real-time events:

```javascript
// When patient sends request
📨 Friend Request Sent: { ... }

// When doctor receives it
✅ Friend Request Notification Sent to: receiverId

// When message is sent
📩 Incoming: { conversationId, sender, content, ... }
✅ Message Sent

// When user joins
✅ User Joined: userId
🟢 User Connected
```

## Common Issues & Solutions

### Issue: "Cannot find route" errors
**Solution**: Make sure you're using the correct route paths in your App.js/routing config

### Issue: Friend request not appearing
**Solution**: 
- Refresh the doctor's requests tab
- Check browser console for errors
- Verify MongoDB is running

### Issue: Messages not sending
**Solution**:
- Check Socket.io connection (DevTools → Network → WS)
- Verify both users are in the same conversation
- Try refreshing the page

### Issue: "Request already exists" error
**Solution**: 
- Can't have multiple pending/accepted requests between same two users
- Cancel previous request first or check if it's already accepted

## Customization Options

### Change Request Endpoint:
Edit `frontend/src/services/friendRequest.js` if your backend route is different:
```javascript
export const sendFriendRequest = async (receiverId, message = "") => {
  const response = await API.post("/friend-request/send", { ... });
  // Change "/friend-request/send" to your endpoint
};
```

### Styling Changes:
All components use Tailwind CSS classes. Modify colors/sizes in:
- `frontend/src/components/FriendRequests.jsx`
- `frontend/src/components/SendFriendRequest.jsx`
- `frontend/src/components/ConnectionsList.jsx`
- `frontend/src/pages/Chat.jsx`

### Chat UI:
Customize message colors, input styling, layout in `Chat.jsx`

## Next Steps

1. ✅ Test the basic flow above
2. 📝 Update your App.js routing to include new pages
3. 🎨 Customize styling to match your design
4. 🔒 Add additional validation/permissions as needed
5. 📱 Test on mobile devices
6. 🚀 Deploy to production

## Support

For issues or questions:
1. Check `IMPLEMENTATION_GUIDE.md` for detailed docs
2. Review Socket.io events in browser console
3. Check backend logs for errors
4. Verify MongoDB connection

Happy Chatting! 🚀
