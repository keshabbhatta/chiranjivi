# 🏥 Healthcare App — Backend API

**Stack:** Node.js · Express · MongoDB · OpenAI · Cloudinary · JWT

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# → Fill in your MongoDB URI, JWT secret, OpenAI key, Cloudinary keys

# 3. Seed the database (sample doctors + admin account)
npm run seed

# 4. Start development server
npm run dev

# 5. Production
npm start
```

---

## 📁 Project Structure

```
src/
├── index.js                  ← Express server entry
├── config/
│   ├── db.js                 ← MongoDB connection
│   └── cloudinary.js         ← Cloudinary config
├── models/
│   ├── User.model.js
│   ├── Doctor.model.js
│   ├── SymptomCheck.model.js
│   ├── LabReport.model.js
│   ├── Chat.model.js
│   └── DietPlan.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── symptom.controller.js
│   ├── labReport.controller.js
│   ├── chat.controller.js
│   ├── doctor.controller.js
│   ├── diet.controller.js
│   └── admin.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── symptom.routes.js
│   ├── labReport.routes.js
│   ├── chat.routes.js
│   ├── doctor.routes.js
│   ├── diet.routes.js
│   └── admin.routes.js
├── middleware/
│   ├── auth.middleware.js    ← JWT + role guards
│   ├── upload.middleware.js  ← Multer + Cloudinary
│   └── errorHandler.js
└── utils/
    └── seed.js               ← DB seeder
```

---

## 🔑 Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint                     | Auth | Description          |
|--------|------------------------------|------|----------------------|
| POST   | `/register`                  | ❌   | Register new user    |
| POST   | `/login`                     | ❌   | Login → get token    |
| GET    | `/me`                        | ✅   | Get current user     |
| POST   | `/forgot-password`           | ❌   | Request reset token  |
| POST   | `/reset-password/:token`     | ❌   | Reset password       |

### Users — `/api/users`
| Method | Endpoint            | Auth | Description         |
|--------|---------------------|------|---------------------|
| GET    | `/profile`          | ✅   | Get own profile     |
| PUT    | `/profile`          | ✅   | Update profile      |
| POST   | `/avatar`           | ✅   | Upload avatar image |
| PUT    | `/change-password`  | ✅   | Change password     |

### Symptom Check — `/api/symptoms`
| Method | Endpoint    | Auth | Description              |
|--------|-------------|------|--------------------------|
| POST   | `/check`    | ✅   | AI symptom analysis      |
| GET    | `/history`  | ✅   | Get all past checks      |
| GET    | `/:id`      | ✅   | Get single check         |
| DELETE | `/:id`      | ✅   | Delete a check           |

**POST /check body:**
```json
{
  "symptoms": ["headache", "fever", "fatigue"],
  "age": 28,
  "gender": "male",
  "duration": "2 days",
  "severity": "moderate"
}
```

### Lab Reports — `/api/lab-reports`
| Method | Endpoint        | Auth | Description              |
|--------|-----------------|------|--------------------------|
| GET    | `/`             | ✅   | Get all reports          |
| POST   | `/`             | ✅   | Upload report (multipart)|
| GET    | `/:id`          | ✅   | Get single report        |
| POST   | `/:id/analyze`  | ✅   | AI analyze report        |
| DELETE | `/:id`          | ✅   | Delete report            |

### Chat — `/api/chat`
| Method | Endpoint    | Auth | Description              |
|--------|-------------|------|--------------------------|
| GET    | `/`         | ✅   | Get all chats            |
| POST   | `/message`  | ✅   | Send message to AI       |
| GET    | `/:id`      | ✅   | Get chat with history    |
| DELETE | `/:id`      | ✅   | Delete chat              |

**POST /message body:**
```json
{
  "message": "I have a headache, what should I do?",
  "chatId": "optional-existing-chat-id"
}
```

### Doctors — `/api/doctors`
| Method | Endpoint              | Auth  | Description             |
|--------|-----------------------|-------|-------------------------|
| GET    | `/`                   | ❌    | List all doctors        |
| GET    | `/specializations`    | ❌    | Get all specializations |
| GET    | `/:id`                | ❌    | Get doctor by ID        |
| POST   | `/`                   | Admin | Create doctor           |
| PUT    | `/:id`                | Admin | Update doctor           |
| DELETE | `/:id`                | Admin | Delete doctor           |

**Query params:** `?specialization=Cardiologist&city=New York&sort=rating&page=1&limit=12&search=heart`

### Diet Plans — `/api/diet`
| Method | Endpoint      | Auth | Description              |
|--------|---------------|------|--------------------------|
| GET    | `/`           | ✅   | Get all diet plans       |
| POST   | `/generate`   | ✅   | AI generate plan         |
| GET    | `/:id`        | ✅   | Get single plan          |
| DELETE | `/:id`        | ✅   | Delete plan              |

**POST /generate body:**
```json
{
  "goal": "weight_loss",
  "dietType": "vegetarian",
  "allergies": ["nuts"],
  "calorieGoal": 1800,
  "duration": 7,
  "age": 28,
  "weight": 75,
  "height": 170
}
```

### Admin — `/api/admin` (Admin only)
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/dashboard`              | Stats overview           |
| GET    | `/users`                  | All users (paginated)    |
| PATCH  | `/users/:id/role`         | Change user role         |
| PATCH  | `/users/:id/status`       | Toggle active/inactive   |
| DELETE | `/users/:id`              | Delete user + all data   |
| PATCH  | `/doctors/:id/verify`     | Verify a doctor          |

---

## 🔗 Connect to your React frontend

In your Redux actions, call:
```js
// Base URL
const API = "http://localhost:5000/api";

// Example: login
const res = await axios.post(`${API}/auth/login`, { email, password });
dispatch(setUser({ user: res.data.user, token: res.data.token }));

// Example: protected request
const res = await axios.get(`${API}/symptoms/history`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🌱 Seed Credentials
```
Admin   : admin@healthcare.com   / Admin@123
Patient : patient@healthcare.com / Patient@123
```
