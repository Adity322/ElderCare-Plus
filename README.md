# ElderCare+ 🏥

> Elderly Nursing & Healthcare Assistance Platform

A full-stack web application that connects elderly patients and their families with verified, trained healthcare professionals for in-home care services.


--- 
  
## 🌐 Live Demo

- **Frontend**: https://elder-care-plus-nx65.vercel.app 
- **Backend API**: https://elder-care-plus.onrender.com
- **Project Report Link:https://drive.google.com/file/d/1rU30C90JhsSzp0NOrPJ03-wRvd5XQ29j/view?usp=share_link
- **Demo video Link:https://drive.google.com/file/d/1JXWOgqgjUDoayKVgW4d4J9uyJ5vh3sDk/view?usp=share_link

---

## 📋 Features

### 👨‍👩‍👧 Family / User
- Register and manage elderly patient profiles
- Browse verified caregivers by service, area, and rating
- Book care services (hourly, daily, long-term)
- Track booking status in real time
- View care notes after each session
- Rate and review caregivers

### 🧑‍⚕️ Caregiver
- Register with qualifications and certifications
- Upload verification documents
- Accept or reject booking requests
- Update session status in real time
- Log care notes and observations after each session

### 👑 Admin
- Verify caregiver applications
- Manage all platform users
- Monitor all bookings across the platform
- Manage service catalog

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | Component-based SPA |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | API calls |
| Socket.io Client | Real-time updates |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database |
| JWT + bcrypt | Authentication |
| Socket.io | Real-time booking status |
| Cloudinary | File and image storage |
| Nodemailer | Password reset emails |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Media storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Clone the repository

```bash
git clone https://github.com/Adity322/ElderCare-Plus.git
cd ElderCare-Plus
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📁 Project Structure

```
eldercare-plus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   └── mailer.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── careController.js
│   │   │   ├── caregiverController.js
│   │   │   ├── patientController.js
│   │   │   ├── serviceController.js
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/
│   │   │   ├── Booking.js
│   │   │   ├── CareNote.js
│   │   │   ├── Caregiver.js
│   │   │   ├── Patient.js
│   │   │   ├── Service.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── careRoutes.js
│   │   │   ├── caregiverRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   └── uploadRoutes.js
│   │   └── app.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── ForgotPassword.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── ResetPassword.jsx
    │   │   ├── family/
    │   │   │   ├── BookService.jsx
    │   │   │   ├── BrowseCaregivers.jsx
    │   │   │   ├── CareNotes.jsx
    │   │   │   ├── FamilyDashboard.jsx
    │   │   │   ├── FamilyLayout.jsx
    │   │   │   ├── MyBookings.jsx
    │   │   │   └── MyPatients.jsx
    │   │   ├── caregiver/
    │   │   │   ├── BookingRequests.jsx
    │   │   │   ├── CaregiverDashboard.jsx
    │   │   │   ├── CaregiverLayout.jsx
    │   │   │   ├── CaregiverNotes.jsx
    │   │   │   ├── CaregiverProfile.jsx
    │   │   │   └── MySchedule.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminBookings.jsx
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminLayout.jsx
    │   │   │   ├── AdminServices.jsx
    │   │   │   ├── UserManagement.jsx
    │   │   │   └── VerifyCaregivers.jsx
    │   │   └── Landing.jsx
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vercel.json
```
---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password/:token` | Public |
| GET | `/api/auth/users` | Admin |

### Patients
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/patients` | User |
| GET | `/api/patients` | User |
| PUT | `/api/patients/:id` | User |
| DELETE | `/api/patients/:id` | User |

### Caregivers
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/caregivers` | Public |
| GET | `/api/caregivers/me` | Caregiver |
| GET | `/api/caregivers/all` | Admin |
| GET | `/api/caregivers/:id` | Authenticated |
| POST | `/api/caregivers/profile` | Caregiver |
| PUT | `/api/caregivers/profile` | Caregiver |
| PUT | `/api/caregivers/profile/photo` | Caregiver |
| PUT | `/api/caregivers/availability` | Caregiver |
| PUT | `/api/caregivers/:id/verify` | Admin |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | User |
| GET | `/api/bookings` | Authenticated |
| PUT | `/api/bookings/:id/status` | Caregiver/Admin |
| DELETE | `/api/bookings/:id` | User |

### Care Notes & Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings/:id/notes` | Caregiver |
| GET | `/api/bookings/:id/notes` | User/Caregiver |
| POST | `/api/bookings/:id/review` | User |

### Services
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/services` | Public |
| GET | `/api/services/all` | Admin |
| POST | `/api/services` | Admin |
| PUT | `/api/services/:id` | Admin |
| PUT | `/api/services/:id/deactivate` | Admin |

### Upload
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/upload/documents` | Caregiver |

---

## 👤 User Roles

| Role | Access |
|---|---|
| Family/User | Manage patients, book caregivers, track sessions |
| Caregiver | Manage profile, accept bookings, log care notes |
| Admin | Verify caregivers, manage users, oversee platform |

---

## 🔑 Creating an Admin Account

Admin accounts cannot be created through the registration form for security reasons.

1. Register normally as a `user`
2. Go to **MongoDB Atlas** → Collections → `users`
3. Find your user and edit `role` from `"user"` to `"admin"`
4. Save and login — you will be redirected to the admin dashboard

---

## 👨‍💻 Author

**Aditya Kumar Singh**
- Domain: Healthcare

---

## 📄 License

This project is developed for internship submission purposes under Unified Mentor.

---

*ElderCare+ — Quality care for your elderly loved ones* 🏥

