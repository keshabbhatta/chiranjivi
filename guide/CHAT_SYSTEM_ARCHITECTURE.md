# Chat System with Friend Requests - Complete Flow

## 🎯 How It Works End-to-End

### **Phase 1: Registration & User Setup**

```
┌─────────────────┐
│  User Signs Up  │
├─────────────────┤
│ Name: John      │
│ Email: john@... │
│ Role: Doctor    │ ← Selected from dropdown
└────────┬────────┘
         │
         ▼
   ┌──────────────────────┐
   │ Backend Register API │
   │ /api/auth/register   │
   └──────────┬───────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌─────────────┐  ┌──────────────┐
│ User Model  │  │ Doctor Model │
│             │  │ (Optional)   │
│ role: doctor│  │              │
└─────────────┘  └──────────────┘
```

---

### **Phase 2: Finding Doctors (Patient Tab)**

**Patient Flow:**
```
1. Patient Login
   ↓
2. Click "Find Doctor" (in navbar)
   ↓
3. Frontend calls: GET /api/doctor/all
   ↓
4. Backend returns:
   - All doctors with role="doctor" from User model
   - Doctor profiles from Doctor model
   ↓
5. Patient sees list of doctors:
   - Dr. Sarah (role: doctor)
   - Dr. Ahmed (role: doctor)
   - Dr. Priya (role: doctor)
```

---

### **Phase 3: Sending Friend Request**

**Patient's Action:**
```
Patient sees: "Dr. Sarah"
     ↓ Click
"Send Friend Request" button
     ↓
emit("sendMessage") via Socket.io
     ↓
Backend creates FriendRequest record:
{
  sender: patient_id,
  receiver: doctor_id (Sarah),
  status: "pending",
  message: "Hi Dr. Sarah..."
}
     ↓
Socket emits: "friendRequestReceived" to Dr. Sarah
```

---

### **Phase 4: Doctor Receives Request**

**Doctor's Chat Interface:**
```
Doctor Login (in another tab)
   ↓
Go to Chat page
   ↓
See TWO tabs:
   ├─ "Chats" (existing conversations)
   └─ "Requests" ← Click here
   ↓
Shows pending friend requests:
   - Patient: John (message: "Hi Dr. Sarah...")
   ↓
Doctor can:
   ✓ Accept  → Creates Conversation, Chat opens
   ✗ Reject → Request deleted, no chat
```

---

### **Phase 5: After Acceptance - Real-time Chat**

**Both parties connected:**
```
Patient                          Doctor
   │                              │
   ├─ emit("join", patientId) ────→ Backend
   │                              ├─ emit("join", doctorId)
   │                              │
   ├─ emit("sendMessage", {...}) ─→ Backend
   │                              │
   │ ← ReceiveMessage event ←─────┤
   │                              │
   ├─ Message displayed ◄────────► ├─ Message displayed
   │                              │
   ├─ Socket connection maintains ─→ Connection persists
   │   real-time updates            (typing, seen status)
```

---

## 🗂️ Database Collections

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: "Dr. Sarah",
  email: "sarah@hospital.com",
  password: hashed,
  role: "doctor",        // ← Key field!
  avatar: "url",
  phone: "1234567890"
}
```

### **FriendRequest Collection**
```javascript
{
  _id: ObjectId,
  sender: ObjectId,      // Patient ID
  receiver: ObjectId,    // Doctor ID
  status: "pending",     // pending | accepted | rejected
  message: "Hi Doctor...",
  conversationId: ObjectId, // Created on accept
  createdAt: Date
}
```

### **Conversation Collection**
```javascript
{
  _id: ObjectId,
  participants: [patientId, doctorId],
  lastMessage: ObjectId,
  lastActivity: Date
}
```

### **Chat Collection** (Messages)
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  sender: ObjectId,
  content: "Hello doctor",
  type: "text",          // text | image
  seen: false,
  createdAt: Date
}
```

---

## 🔄 Socket.io Events

### **Emitted by Frontend:**

| Event | Data | Purpose |
|-------|------|---------|
| `join` | `{ userId }` | User comes online |
| `sendFriendRequest` | `{ requestId, receiver, sender }` | Notify doctor of request |
| `sendMessage` | `{ conversationId, sender, receiver, content }` | Send chat message |
| `typing` | `{ sender, receiver }` | Show typing indicator |
| `seen` | `{ messageId }` | Mark message as read |
| `disconnect` | - | User goes offline |

### **Received by Frontend:**

| Event | Data | Purpose |
|-------|------|---------|
| `onlineUsers` | `[userId1, userId2,...]` | Update online status |
| `friendRequestReceived` | `friendRequest obj` | Show request in doctor's panel |
| `friendRequestAccepted` | `{ requestId }` | Patient can now chat |
| `receiveMessage` | `message obj` | Display incoming message |
| `typing` | `{ sender }` | Show typing indicator |
| `messageSeen` | `{ messageId }` | Update message status |

---

## 🚀 Complete Chat Initiation Sequence

### **Step 1: Patient Sends Request**
```
Patient Page (Find Doctor)
├─ Sees: Dr. Sarah Card
├─ Click: "Send Friend Request"
├─ Modal: Enter message "Hi, I need consultation"
├─ Submit
│  ├─ API: POST /api/friend-request/send
│  │  └─ Backend: Create FriendRequest(sender: patientId, receiver: doctorId)
│  └─ Socket: emit("sendFriendRequest", { requestId, receiver: doctorId })
│
└─ Backend receives socket event
   └─ io.to(doctorId).emit("friendRequestReceived", fullRequest)
```

### **Step 2: Doctor Receives & Accepts**
```
Doctor Chat Page
├─ See: "Requests" tab shows pending request
├─ View: Patient name + message
├─ Click: "Accept"
│  ├─ API: PUT /api/friend-request/accept/:requestId
│  │  └─ Backend: 
│  │     ├─ Create Conversation(participants: [patientId, doctorId])
│  │     └─ Update FriendRequest(status: "accepted")
│  └─ Socket: emit("acceptFriendRequest", { requestId, senderId })
│
└─ Backend receives socket event
   └─ io.to(patientId).emit("friendRequestAccepted", ...)
```

### **Step 3: Chat Opens for Both**
```
Patient                          Doctor
├─ Notification: "Dr. Sarah      ├─ Request removed from list
│  accepted your request!"       ├─ Conversation auto-opens
├─ Click: Start chat             ├─ emit("join", doctorId)
├─ emit("join", patientId)       │
├─ Conversation loads            ├─ Conversation loads
├─ Can now send messages ◄──────► ├─ Can send/receive messages
```

---

## 🔍 Why Patient Can't See Doctor in First Tab

### **Current Issues:**

1. **Two Doctor Sources:**
   - User Collection: `{ role: "doctor" }` ← What happens when doc signs up
   - Doctor Collection: `{ specialization, verified, ... }` ← What Admin creates

2. **API calls only Doctor Collection:**
   ```javascript
   GET /api/doctor/all
   // Only returns Doctor.model records
   // Doesn't return User records with role="doctor"
   ```

3. **Solution:**
   - Update `/api/doctor/all` to query BOTH collections
   - OR: Automatically create Doctor profile on signup
   - OR: Add endpoint `/api/users?role=doctor`

---

## ✅ What's Working

- ✅ User registration with role selection
- ✅ Socket.io connection
- ✅ Friend request API
- ✅ Message sending via Socket.io
- ✅ Real-time chat

## ⚠️ What Needs Fixing

- ❌ `/api/doctor/all` doesn't show doctors who just signed up
- ❌ No automatic Doctor profile creation on signup
- ❌ FindDoctorAdvanced calls wrong endpoint

## 🛠️ Recommended Fix

**Option 1 (Quickest):** Create endpoint to fetch doctors from User model
```javascript
GET /api/doctor/by-role
// Returns all users with role="doctor"
```

**Option 2 (Best):** Auto-create Doctor profile on signup
```javascript
// In auth.controller.js register() function
if (role === "doctor") {
  await Doctor.create({ userId, name, email, ... });
}
```

**Option 3 (Most Flexible):** Union both collections in endpoint
```javascript
// Modified doctor controller
const doctors = [
  ...await User.find({ role: "doctor" }),
  ...await Doctor.find({ ... })
];
```
