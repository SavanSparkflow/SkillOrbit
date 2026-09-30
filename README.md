# 🚀 SkillOrbit - Next-Gen Full-Stack LMS Platform

<div align="center">

![SkillOrbit Platform](https://img.shields.io/badge/SkillOrbit-LMS%20Platform-6366f1?style=for-the-badge&logo=rocket)
![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node)-10b981?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06b6d4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

**A modern, production-grade, enterprise-ready Learning Management & Video Streaming Platform built with MERN Stack, Zustand, Cloudinary, Razorpay, and Recharts.**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Installation](#-getting-started) • [API Documentation](#-api-endpoints) • [Demo Accounts](#-demo-credentials)

</div>

---

## 🌟 Overview

**SkillOrbit** is a high-performance course creation, video learning, and community platform inspired by modern ed-tech leaders like Udemy and Coursera. Designed with a sleek dark-mode glassmorphism aesthetic, SkillOrbit provides an immersive learning room for students and an intuitive analytics-driven workspace for instructors.

---

## ✨ Key Features

### 🎓 1. Immersive Student Learning Room
- **Pro Video Player**:
  - Buffer-free streaming with playback speeds (0.5x – 2.0x) and persistent memory.
  - Full keyboard shortcuts (`Space` / `K` Play/Pause, `←` / `→` Seek 5s, `M` Mute, `F` Fullscreen).
  - ⏭️ **Auto-Play Next Lesson**: 5-second countdown overlay to smoothly transition to the next lesson.
  - Anti-piracy context-menu protection.
- **💻 Interactive Code Playground**:
  - In-browser HTML, CSS, and JavaScript editor with live sandbox iframe preview.
  - Interactive console terminal for real-time JavaScript log inspection and hands-on coding practice while watching lessons.
- **📝 Lesson-Wise & Chapter-Wise MCQ Quizzes**:
  - Dedicated interactive quizzes per individual lesson and per chapter.
  - Instant scoring, question-by-question explanations, and progress checkpoints.
- **💬 Lesson Q&A Discussion Forum**:
  - Students can ask questions directly on any specific lesson.
  - Community replies, upvoting system, verified Instructor badges, and "Mark as Resolved" toggles.
- **📢 Course Announcements Feed**:
  - Direct updates from instructors with pinned critical notices.
- **📜 Verified PDF Certificate with Dynamic QR Code**:
  - Automated certificate unlock upon 100% course completion.
  - High-res downloadable PDF generated via `jsPDF` containing an embedded QR code.
  - **Public Verification Route**: Scan the QR code or visit `/verify-certificate/:certificateId` to view real-time cryptographic verification details and shareable social links.

---

### 👨‍🏫 2. Instructor & Teacher Management Portal
- **Course & Curriculum Builder**:
  - Multi-tier course architecture: Courses ➔ Chapters ➔ Lessons.
  - Video upload integration powered by Cloudinary.
  - Downloadable lesson resources attachment manager (PDFs, Source code, ZIPs).
  - Per-lesson and chapter quiz creation wizard.
- **🎟️ Dynamic Coupon & Promo Code Engine**:
  - Create **Universal Coupons** (applies across the entire cart) or **Course-Specific Coupons** (applies discount only to a selected target course).
  - Configurable discount percentage, maximum redemptions, and expiration dates.
  - Real-time coupon redemption tracking and active/expired status badges.
- **📢 Announcement Publisher**:
  - Publish course-wide notices and pin urgent updates for enrolled students.
- **📊 Interactive Analytics & Earnings Dashboard**:
  - Visual charts built with `recharts` (Area Charts for monthly revenue trends & Bar Charts for course enrollment distribution).
  - Lifetime revenue metrics, total active students, average course ratings, and order statistics.

---

### 🛒 3. E-Commerce & Checkout Workflow
- **Stateful Shopping Cart**:
  - Persistent cart state managed via Zustand.
  - Course-specific or universal promo code application with dynamic discount breakdown.
  - Protected checkout redirect ensuring user identity and data integrity.
- **Payment Gateway**:
  - Seamless checkout flow integrated with Razorpay.
  - Instant enrollment unlock upon verified transaction.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18/19, Vite, Tailwind CSS, Lucide React, Zustand, Axios, Recharts, jsPDF, QRCode, Canvas Confetti |
| **Backend** | Node.js, Express.js (MVC Pattern), Mongoose |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Media & Storage** | Cloudinary API (Video Streaming & Image Assets) |
| **Payments** | Razorpay Payment Gateway |
| **Security** | JSON Web Tokens (JWT), BcryptJS, Helmet, Express Rate Limit, CORS |

---

## 📂 Project Structure

```text
SkillOrbit/
├── server/
│   ├── src/
│   │   ├── config/             # Database & Cloudinary config
│   │   ├── controllers/        # Auth, Course, Chapter, Lesson, Quiz, Progress, Discussion, Coupon, Announcement, Order, Stats
│   │   ├── middlewares/        # JWT Protect & Role Authorize, Error Handling
│   │   ├── models/             # User, Course, Chapter, Lesson, Quiz, Progress, Review, Order, Discussion, Coupon, Announcement
│   │   ├── routes/             # REST API endpoints
│   │   ├── utils/              # Seed data script, JWT token helper
│   │   └── server.js           # Express app & route mounting
│   ├── .env                    # Backend environment config
│   └── package.json
└── client/
    ├── src/
    │   ├── api/                # Axios instance & interceptors
    │   ├── components/         # Modular UI components
    │   │   ├── common/         # Navbar, Footer, Modal, Button, Badge
    │   │   └── courses/        # VideoPlayer, CodePlayground, LessonDiscussions, CourseAnnouncements, CurriculumTree
    │   ├── pages/              # Home, Courses, CourseDetail, LearningRoom, VerifyCertificate, Dashboard, Cart, Checkout, Teacher Portal
    │   ├── store/              # Zustand global state (authStore, courseStore, cartStore)
    │   ├── App.jsx             # React Router route registry
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or MongoDB Atlas connection string

---

### 1. Backend Server Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skillorbit
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. *(Optional)* Seed sample courses, lessons, and test accounts:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > Backend runs on: `http://localhost:5000`

---

### 2. Frontend Client Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > Frontend runs on: `http://localhost:5173`

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student or teacher account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Get current logged-in profile

### 📚 Courses & Content (`/api/courses`)
- `GET /api/courses` — Get all published courses with search & category filters
- `GET /api/courses/:id` — Get full course details with curriculum outline
- `POST /api/courses` — Create new course *(Instructor only)*
- `PUT /api/courses/:id` — Update course details *(Instructor only)*
- `DELETE /api/courses/:id` — Delete course *(Instructor only)*

### 📝 Quizzes (`/api/quizzes`)
- `GET /api/quizzes/lesson/:lessonId` — Get quiz attached to a specific lesson
- `GET /api/quizzes/chapter/:chapterId` — Get chapter-level quiz
- `POST /api/quizzes` — Create or update lesson/chapter quiz *(Instructor only)*
- `POST /api/quizzes/:id/submit` — Submit answers and calculate score

### 💬 Q&A Discussions (`/api/discussions`)
- `GET /api/discussions/lesson/:lessonId` — Get all questions & answer threads for a lesson
- `POST /api/discussions` — Post a new question
- `POST /api/discussions/:id/reply` — Post a reply/answer
- `PUT /api/discussions/:id/upvote` — Upvote or remove upvote on a discussion
- `PUT /api/discussions/:id/resolve` — Mark discussion as resolved *(Author/Instructor)*

### 📢 Announcements (`/api/announcements`)
- `GET /api/announcements/course/:courseId` — Get all announcements for a course
- `POST /api/announcements` — Publish a new course announcement *(Instructor only)*
- `DELETE /api/announcements/:id` — Delete announcement *(Instructor only)*

### 🎟️ Coupons (`/api/coupons`)
- `POST /api/coupons/validate` — Validate a promo code against cart items (course-specific or universal)
- `GET /api/coupons/my-coupons` — Get all coupons created by the instructor *(Instructor only)*
- `POST /api/coupons` — Create a new universal or course-specific coupon *(Instructor only)*
- `DELETE /api/coupons/:id` — Delete or deactivate coupon *(Instructor only)*

### 📜 Progress & Certificates (`/api/progress`)
- `GET /api/progress/:courseId` — Get student's completed lessons and quiz scores
- `POST /api/progress/complete-lesson` — Mark a lesson as completed
- `GET /api/progress/verify-certificate/:certificateId` — Public certificate verification lookup

### 📊 Analytics & Orders (`/api/stats`, `/api/orders`)
- `GET /api/stats/instructor` — Get earnings, enrollment distribution, and monthly revenue analytics
- `POST /api/orders/create-razorpay-order` — Initialize checkout order

---

## 👥 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **👨‍🏫 Instructor** | `teacher@skillorbit.com` | `password123` | Teacher Dashboard, Course Builder, Coupon Manager, Analytics |
| **🎓 Student** | `student@skillorbit.com` | `password123` | Course Enrollment, Learning Room, Code Playground, Certificates |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and customize it for your own educational or commercial projects.
