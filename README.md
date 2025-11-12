# Learnly Backend API

A comprehensive **Node.js + Express.js** backend system for an **Online Course Learning Management System (LMS)** with advanced features including course management, payment processing with Razorpay, EMI (Equated Monthly Installment) plans, automated notifications, exam management, and more.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [EMI System Architecture](#-emi-system-architecture)
- [Payment Integration](#-payment-integration)
- [Notification System](#-notification-system)
- [Authentication & Authorization](#-authentication--authorization)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

**Learnly Backend** is a robust RESTful API backend for an e-learning platform that enables:

- **User Management**: Registration, authentication, profile management with OTP verification
- **Course Management**: Multi-media course content (video, audio, PDF), chapter-based learning
- **Payment Processing**: Razorpay integration with full payment and EMI options
- **EMI System**: Advanced EMI plan management with automated reminders, overdue tracking, and course access control
- **Exam System**: Chapter-wise exams with answer submission and result tracking
- **Notification System**: Multi-channel notifications (Email, SMS, WhatsApp) via Nodemailer and Twilio
- **Admin Panel**: Course creation, user management, EMI administration
- **File Management**: AWS S3 integration for media storage

---

## ✨ Key Features

### 1. **User Authentication & Authorization**

- Email and mobile-based registration with OTP verification
- JWT-based authentication with 5-day token expiry
- Role-based access control (User/Admin)
- Forgot password with OTP verification
- Profile picture upload to AWS S3
- Login/logout tracking with session management

### 2. **Course Management**

- Hierarchical course structure: Course → Chapters → Lessons
- Multi-media support: Audio, Video, PDF files
- Course categories and difficulty levels (Beginner/Medium/Hard)
- Course thumbnails and preview videos
- Dynamic pricing with discount support
- EMI availability configuration per course
- Course enrollment tracking

### 3. **Payment System**

- Razorpay integration for secure payments
- Two payment modes:
  - **Full Payment**: One-time course purchase
  - **EMI Payment**: Installment-based payments (6, 12, 24 months)
- Payment verification with signature validation
- Webhook handling for payment status updates
- Transaction history and receipt generation

### 4. **Advanced EMI System**

- Flexible EMI plans with configurable duration (6/12/24 months)
- User-selectable due dates (1-15 of each month)
- Automated EMI schedule generation
- Grace period management
- Overdue tracking and notifications
- Course access locking/unlocking based on payment status
- EMI payment history and status tracking
- Bulk overdue payment support

### 5. **Automated Notification System**

- **Email Notifications**: Welcome emails, payment reminders, overdue notices
- **SMS Notifications**: Via Twilio for critical alerts
- **WhatsApp Notifications**: Payment reminders and updates
- Scheduled cron jobs for automated reminders
- Rich HTML email templates
- Notification history tracking

### 6. **Exam Management**

- Chapter-wise exam creation
- Multiple question types support
- Exam attempt tracking
- Score calculation and result storage
- User exam history

### 7. **Admin Features**

- Course creation with multi-media upload
- Course content management (CRUD operations)
- EMI plan administration
- User payment monitoring
- System health checks

---

## 🛠 Tech Stack

### **Backend Framework**

- **Node.js** (v14+)
- **Express.js** (v4.21.2)

### **Database**

- **MongoDB** (v8.9.3) with Mongoose ODM
- MongoDB Atlas for cloud database hosting

### **Authentication & Security**

- **JWT** (jsonwebtoken v9.0.2)
- **Bcrypt** (v5.1.1) for password hashing
- **Crypto** for signature verification

### **Payment Integration**

- **Razorpay** (v2.9.6)

### **Cloud Services**

- **AWS S3** for media storage
- **@aws-sdk/client-s3** (v3.832.0)

### **Communication**

- **Nodemailer** (v6.9.16) for email
- **Twilio** (v5.4.3) for SMS/WhatsApp

### **Utilities**

- **Multer** (v1.4.5-lts.1) for file uploads
- **CORS** (v2.8.5)
- **Dotenv** (v16.4.7) for environment variables
- **Node-cron** (v4.2.0) for scheduled tasks

### **Development Tools**

- **Nodemon** (v3.1.9)
- **Jest** (v30.2.0) for testing
- **Supertest** (v7.1.4) for API testing
- **MongoDB Memory Server** (v10.2.1) for test database

---

## 🏗 Project Architecture

```
┌─────────────────┐
│   Client/UI     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Express.js Middleware           │
│  ├─ CORS                                │
│  ├─ JSON Parser                         │
│  ├─ Authentication (JWT)                │
│  └─ Route Protection                    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│            Routes Layer                 │
│  ├─ User Routes                         │
│  ├─ Course Routes                       │
│  ├─ Payment Routes                      │
│  ├─ EMI Routes                          │
│  ├─ Exam Routes                         │
│  ├─ Admin Routes                        │
│  └─ Webhook Routes                      │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Controllers Layer               │
│  ├─ Business Logic                      │
│  ├─ Request Validation                  │
│  ├─ Response Formatting                 │
│  └─ Error Handling                      │
└────────┬────────────────────────────────┘
         │
         ├──────────────┬─────────────────┐
         ▼              ▼                 ▼
┌────────────┐  ┌──────────────┐  ┌─────────────┐
│  Services  │  │ Middleware   │  │ Utilities   │
│  Layer     │  │ Layer        │  │ Layer       │
└────┬───────┘  └──────┬───────┘  └──────┬──────┘
     │                 │                  │
     ▼                 ▼                  ▼
┌─────────────────────────────────────────┐
│           Models Layer (Mongoose)       │
│  ├─ User Model                          │
│  ├─ Course Model                        │
│  ├─ Payment Model                       │
│  ├─ EMI Plan Model                      │
│  └─ Exam Models                         │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          MongoDB Database               │
└─────────────────────────────────────────┘

External Services:
├─ Razorpay (Payments)
├─ AWS S3 (File Storage)
├─ Twilio (SMS/WhatsApp)
└─ Gmail SMTP (Email)
```

---

## 📁 Folder Structure

```
learnly_backend/
├── server.js                      # Application entry point
├── package.json                   # Dependencies and scripts
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── fix-emi-plan.js               # EMI plan fixing utility
├── README.md                     # Project documentation
│
├── uploads/                      # Temporary upload directory
│
└── src/
    ├── config/                   # Configuration files
    │   └── audio-s3.js          # S3 client configuration
    │
    ├── Controllers/              # Request handlers
    │   ├── Admin/
    │   │   ├── Course-Upload.js           # Admin course management
    │   │   └── EMI-Admin-Controller.js    # EMI administration
    │   ├── Course-Controller/
    │   │   └── Course-Controller.js       # Course CRUD operations
    │   ├── Emi-Controller/
    │   │   └── EmiController.js           # EMI payment handling
    │   ├── Exam-Controller/
    │   │   ├── Exam-Question-Controll.js  # Exam management
    │   │   └── User-Submit-Answer.js      # Exam submissions
    │   ├── Payment-controller/
    │   │   ├── Payment-Controller.js      # Payment processing
    │   │   └── Webhook-Handler.js         # Razorpay webhooks
    │   ├── Purchased-courses/
    │   │   └── purchasedcourse-controller.js
    │   └── user-Controller/
    │       ├── User-Auth-Controller.js    # Authentication
    │       └── user-profile-controller.js # Profile management
    │
    ├── DB/
    │   └── db.js                 # MongoDB connection
    │
    ├── Middleware/               # Custom middleware
    │   ├── authMiddleware.js    # JWT verification
    │   └── EMI-accessMiddleware.js # Course access control
    │
    ├── Models/                   # Mongoose schemas
    │   ├── Course-Model/
    │   │   └── Course-model.js
    │   ├── Emi-Plan/
    │   │   └── Emi-Plan-Model.js
    │   ├── Exam-Model/
    │   │   ├── Exam-Question-Model.js
    │   │   └── User-Submit-Model.js
    │   ├── Payment-Model/
    │   │   └── Payment-Model.js
    │   └── User-Model/
    │       └── User-Model.js
    │
    ├── Notification/             # Notification services
    │   └── EMI-Notification.js
    │
    ├── Routes/                   # API routes
    │   ├── Admin/
    │   │   └── course-upload-routes.js
    │   ├── Course-routes/
    │   │   └── Course-routes.js
    │   ├── Exan-Question-Routes.js/
    │   │   └── Exam-Question-Routes.js
    │   ├── Payment-Routes/
    │   │   └── Payment-Routes.js
    │   ├── Purchased-routes/
    │   │   └── Purchased-routs.js
    │   └── users-routes/
    │       ├── User-Routes.js
    │       └── user-profile-routes.js
    │
    ├── Services/                 # Business logic services
    │   ├── EMI-DateUtils.js     # Date calculation utilities
    │   ├── EMI-Service.js       # EMI management service
    │   └── EMI-Utils.js         # EMI helper functions
    │
    └── Utils/                    # Utility functions
        ├── EmailTransport.js    # Email sending utility
        ├── JwtToken.js          # JWT generation
        ├── logger.js            # Logging utility
        ├── MobileTranspost.js   # SMS/WhatsApp utility
        ├── OTPGenerate.js       # OTP generation
        └── validate.js          # Input validation
```

---

## 💾 Database Schema

### **User Schema**

```javascript
{
  studentRegisterNumber: String (unique),
  email: String (unique),
  mobile: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  username: String,
  fatherName: String,
  dateofBirth: Date,
  gender: String,
  address: {
    street, city, state, country, zipCode
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  enrolledCourses: [{
    course: ObjectId (ref: Course),
    enrollmentDate: Date,
    progress: Number,
    accessStatus: String (active/locked)
  }],
  loginHistory: [{
    loginTime, ipAddress, userAgent, logoutTime, sessionDuration
  }],
  status: String (active/inactive/logged-out)
}
```

### **Course Schema**

```javascript
{
  CourseMotherId: String,
  coursename: String (unique),
  category: String,
  courseduration: String (6 months/1 year/2 years),
  thumbnail: String,
  previewvideo: String,
  contentduration: { hours, minutes },
  chapters: [{
    title: String,
    lessons: [{
      lessonname: String,
      audioFile: [{ name, url }],
      videoFile: [{ name, url }],
      pdfFile: [{ name, url }]
    }],
    exam: ObjectId (ref: ExamQuestion)
  }],
  price: {
    amount: Number,
    currency: String,
    discount: Number,
    finalPrice: Number
  },
  emi: {
    isAvailable: Boolean,
    emiDurationMonths: Number,
    monthlyAmount: Number,
    totalAmount: Number,
    notes: String
  },
  level: String (beginner/medium/hard),
  instructor: [{ name, role, socialmedia_id }],
  isActive: Boolean
}
```

### **Payment Schema**

```javascript
{
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  username: String,
  studentRegisterNumber: String,
  email: String,
  mobile: String,
  CourseMotherId: String,
  courseName: String,
  paymentType: String (full/emi/emi_overdue/emi_installment),
  emiDueDay: Number,
  emiPlanId: ObjectId (ref: EMIPlan),
  emiInstallments: [{
    emiId: ObjectId,
    month: Number,
    monthName: String,
    amount: Number,
    dueDate: Date,
    wasOverdue: Boolean
  }],
  amount: Number,
  currency: String,
  paymentStatus: String (pending/completed/failed/cancelled),
  transactionId: String (unique),
  paymentMethod: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String
}
```

### **EMI Plan Schema**

```javascript
{
  userId: ObjectId (ref: User),
  username: String,
  studentRegisterNumber: String,
  email: String,
  mobile: String,
  courseId: ObjectId (ref: Course),
  CourseMotherId: String,
  coursename: String,
  coursePrice: Number,
  courseduration: String,
  totalAmount: Number,
  emiPeriod: Number,
  selectedDueDay: Number (1-15),
  startDate: Date,
  status: String (active/locked/completed/cancelled),
  emis: [{
    month: Number,
    monthName: String,
    dueDate: Date,
    amount: Number,
    status: String (pending/paid/late),
    paymentDate: Date,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    gracePeriodEnd: Date
  }],
  lockHistory: [{
    lockDate: Date,
    unlockDate: Date,
    overdueMonths: Number,
    reasonForLock: String,
    lockedBy: String
  }],
  notifications: [{
    type: String (reminder/overdue/final_notice/welcome/lock/unlock),
    sentAt: Date,
    channel: String (gmail/sms/whatsapp),
    status: String (sent/failed/pending),
    metadata: Object
  }]
}
```

---

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- Razorpay account (for payments)
- AWS account (for S3 storage)
- Twilio account (for SMS/WhatsApp)
- Gmail account (for email notifications)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/logicalmindsit/learnly_backend.git
cd learnly_backend
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Configure Environment Variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials (see [Environment Configuration](#-environment-configuration) section).

### **Step 4: Start MongoDB**

Ensure MongoDB is running locally or use MongoDB Atlas connection string.

### **Step 5: Run the Application**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8000`

---

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development  # development | production | testing

# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/learnly-main

# JWT Secret
JWT_SECRET=your_secret_key_here

# Email Configuration (Gmail)
EMAIL_ADMIN=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-south-1

# Suppress AWS SDK warnings
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1
```

### **Important Notes:**

1. **Gmail App Password**: Enable 2-factor authentication and generate an app-specific password
2. **Twilio**: Verify your phone number in Twilio console for testing
3. **Razorpay**: Use test keys for development, live keys for production
4. **AWS S3**: Create a bucket with proper permissions for public read access
5. **Never commit `.env` file** - It's already in `.gitignore`

---

## 🏃 Running the Application

### **Development Mode**

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.

### **Production Mode**

```bash
npm start
```

### **Health Check**

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "ok",
  "service": "NodeJS API",
  "timestamp": "2025-11-04T10:30:00.000Z",
  "environment": "development",
  "dependencies": {
    "database": "connected"
  }
}
```

### **Testing**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

---

## 📚 API Documentation

### **Base URL**

```
http://localhost:8000
```

### **Authentication**

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

### **1. User Authentication APIs**

#### **Register User**

```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com"  // OR "mobile": "+919876543210"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "identifier": "user@example.com",
    "type": "email"
  }
}
```

#### **Verify OTP**

```http
POST /verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### **Create Password**

```http
POST /create-password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

#### **Complete Registration**

```http
POST /complete-registration
Content-Type: multipart/form-data

{
  "email": "user@example.com",
  "username": "johndoe",
  "fatherName": "John Sr.",
  "dateofBirth": "1990-01-01",
  "gender": "Male",
  "bloodGroup": "O+",
  "address": {...},
  "profilePicture": <file>
}
```

#### **Login**

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",  // OR "mobile": "+919876543210"
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### **Logout**

```http
POST /logout
Authorization: Bearer <token>
```

#### **Forgot Password Flow**

```http
# 1. Request OTP
POST /forgot-password
{ "email": "user@example.com" }

# 2. Verify OTP
POST /verify-forgot-password-otp
{ "email": "user@example.com", "otp": "123456" }

# 3. Reset Password
POST /reset-password
{ "email": "user@example.com", "newPassword": "NewPassword123!" }
```

---

### **2. Course APIs**

#### **Get All Courses (Public)**

```http
GET /courses/user-view
```

**Response:**

```json
{
  "success": true,
  "courses": [
    {
      "_id": "courseId",
      "coursename": "Full Stack Development",
      "category": "Programming",
      "thumbnail": "https://...",
      "price": {
        "amount": 15000,
        "finalPrice": 12000,
        "discount": 20
      },
      "emi": {
        "isAvailable": true,
        "monthlyAmount": 1200
      }
    }
  ]
}
```

#### **Get Course Details (Protected)**

```http
GET /courses/:id
Authorization: Bearer <token>
```

**Response includes:**

- Complete course information
- Payment status check
- Access status (locked/unlocked)
- EMI plan details (if applicable)

#### **Get Course Content (Protected)**

```http
GET /courses/:id/content
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "hasAccess": true,
  "course": {
    "chapters": [{
      "title": "Introduction",
      "lessons": [{
        "lessonname": "Welcome",
        "videoFile": [{ "name": "intro.mp4", "url": "https://..." }],
        "audioFile": [...],
        "pdfFile": [...]
      }]
    }]
  }
}
```

---

### **3. Payment APIs**

#### **Create Payment**

```http
POST /user/payment/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "courseId",
  "amount": 12000,
  "paymentMethod": "UPI",
  "paymentType": "full",  // OR "emi"
  "emiDueDay": 5  // Required if paymentType is "emi" (1-15)
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "razorpayOrderId": "order_xxxxx",
    "amount": 12000,
    "currency": "INR"
  },
  "payment": {
    "_id": "paymentId",
    "transactionId": "TXN123456"
  }
}
```

#### **Verify Payment**

```http
POST /user/payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_xxxxx",
  "transactionId": "TXN123456"
}
```

#### **Get User Payments**

```http
GET /user/payment
Authorization: Bearer <token>
```

#### **Get EMI Details for Course**

```http
GET /user/payment/emi-details/:courseId
Authorization: Bearer <token>
```

---

### **4. EMI Management APIs**

#### **Get EMI Status**

```http
GET /user/emi/status/:courseId
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "emiPlan": {
    "status": "active",
    "totalAmount": 14400,
    "emiPeriod": 12,
    "paidEmis": 3,
    "pendingEmis": 9,
    "overdueEmis": 1,
    "nextDueDate": "2025-12-05",
    "nextDueAmount": 1200
  }
}
```

#### **Get Monthly Due Amount**

```http
GET /user/emi/monthly-due/:courseId
Authorization: Bearer <token>
```

#### **Get Due Amounts (Overdue)**

```http
GET /user/emi/due-amounts/:courseId
Authorization: Bearer <token>
```

#### **Pay Monthly EMI**

```http
POST /user/emi/pay-monthly
Authorization: Bearer <token>

{
  "courseId": "courseId",
  "emiMonth": 5
}
```

#### **Pay Overdue EMIs**

```http
POST /user/emi/pay-overdue
Authorization: Bearer <token>

{
  "courseId": "courseId",
  "emiIds": ["emiId1", "emiId2"]  // Optional: specific EMIs or all overdue
}
```

#### **Verify EMI Payment**

```http
POST /user/emi/verify-payment
Authorization: Bearer <token>

{
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_xxxxx",
  "courseId": "courseId",
  "emiIds": ["emiId1", "emiId2"]
}
```

#### **Get EMI Summary**

```http
GET /user/emi/summary
Authorization: Bearer <token>
```

---

### **5. Exam APIs**

#### **Get Exam Questions**

```http
GET /exam-question?courseId=xxx&chapterId=xxx
Authorization: Bearer <token>
```

#### **Submit Exam**

```http
POST /user/exam/answer-submit
Authorization: Bearer <token>

{
  "courseId": "courseId",
  "chapterId": "chapterId",
  "examId": "examId",
  "answers": [{
    "questionId": "q1",
    "selectedAnswer": "option2"
  }]
}
```

#### **Get Exam Results**

```http
GET /user/exam/result?courseId=xxx&chapterId=xxx
Authorization: Bearer <token>
```

---

### **6. Admin APIs**

#### **Create Course**

```http
POST /createcourses
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "coursename": "Full Stack Development",
  "category": "Programming",
  "courseduration": "1 year",
  "price": 15000,
  "emi": {
    "isAvailable": true,
    "emiDurationMonths": 12,
    "monthlyAmount": 1200
  },
  "chapters": [...],
  // + multimedia files
}
```

#### **Get All Courses (Admin)**

```http
GET /courses
Authorization: Bearer <token>
```

#### **Update Course**

```http
PUT /updatecourse/:courseId
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### **Delete Course**

```http
DELETE /courses/:courseId
Authorization: Bearer <token>
```

---

### **7. Purchased Courses**

#### **Get User's Purchased Courses**

```http
GET /user/purchased-courses/:userId
Authorization: Bearer <token>
```

---

### **8. Webhook Endpoint**

#### **Razorpay Webhook**

```http
POST /webhook/razorpay
Content-Type: application/json
X-Razorpay-Signature: <signature>

{
  "event": "payment.captured",
  "payload": {...}
}
```

**Note:** This endpoint is public but secured with Razorpay signature verification.

---

## 🔄 EMI System Architecture

### **EMI Workflow**

```
┌─────────────────────────────────────────────┐
│  1. User Selects EMI Payment Option         │
│     - Selects due day (1-15)                │
│     - Chooses EMI duration (6/12/24 months) │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  2. EMI Plan Creation                       │
│     - Calculate monthly amount              │
│     - Generate EMI schedule                 │
│     - Set grace periods                     │
│     - Create first EMI order                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  3. First EMI Payment (Instant)             │
│     - Pay via Razorpay                      │
│     - Mark first EMI as paid                │
│     - Grant course access                   │
│     - Send welcome notification             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  4. Automated Cron Jobs (Every 3 minutes)   │
│     ┌─────────────────────────────────────┐ │
│     │  Check for upcoming due dates       │ │
│     │  Send reminder notifications        │ │
│     │  (3 days before, 1 day before)      │ │
│     └─────────────────────────────────────┘ │
│     ┌─────────────────────────────────────┐ │
│     │  Check for overdue EMIs             │ │
│     │  Send overdue notifications         │ │
│     │  Lock course access if needed       │ │
│     └─────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  5. Monthly Payment Cycle                   │
│     - User pays monthly EMI                 │
│     - System verifies payment               │
│     - Update EMI status                     │
│     - Unlock course access if locked        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  6. Overdue Handling                        │
│     - Grace period: 3 days after due date   │
│     - After grace: Mark as "late"           │
│     - Send escalated notifications          │
│     - Lock course access                    │
│     - Allow bulk overdue payment            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  7. Completion                              │
│     - All EMIs paid                         │
│     - Mark plan as "completed"              │
│     - Permanent course access               │
│     - Send completion certificate           │
└─────────────────────────────────────────────┘
```

### **EMI Calculation Logic**

```javascript
// Example: Course price = ₹12,000, EMI period = 12 months
totalEMIAmount = coursePrice; // ₹12,000
monthlyAmount = totalEMIAmount / emiPeriod; // ₹1,000

// EMI Schedule Generation
for (let month = 1; month <= emiPeriod; month++) {
  const dueDate = calculateDueDate(startDate, month, selectedDueDay);
  const gracePeriodEnd = addDays(dueDate, 3);

  emis.push({
    month: month,
    monthName: getMonthName(dueDate),
    dueDate: dueDate,
    amount: monthlyAmount,
    status: "pending",
    gracePeriodEnd: gracePeriodEnd,
  });
}
```

### **Course Access Control Logic**

```javascript
// Access Check Flow
if (fullPaymentExists && completed) {
  return "GRANT ACCESS";
}

if (emiPlanExists) {
  if (emiPlan.status === "locked") {
    return "DENY ACCESS - EMI Overdue";
  }

  if (emiPlan.status === "active") {
    return "GRANT ACCESS";
  }
}

return "DENY ACCESS - No Payment";
```

### **Automated Notification Schedule**

| Event           | Timing                            | Channels             | Template                          |
| --------------- | --------------------------------- | -------------------- | --------------------------------- |
| Welcome         | Immediate after first EMI payment | Email, SMS           | Welcome email with course details |
| Reminder        | 3 days before due date            | Email, WhatsApp      | Payment reminder                  |
| Reminder        | 1 day before due date             | Email, SMS           | Urgent reminder                   |
| Due Date        | On due date                       | Email, SMS           | Payment due today                 |
| Overdue         | 1 day after grace period          | Email, SMS, WhatsApp | Overdue notice                    |
| Lock Warning    | 3 days after overdue              | Email, SMS           | Final warning before lock         |
| Course Locked   | When access locked                | Email, SMS           | Access suspended notice           |
| Course Unlocked | When payment received             | Email                | Access restored notice            |

---

## 💳 Payment Integration

### **Razorpay Integration Flow**

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │  Backend │         │ Razorpay │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ 1. Create Payment  │                     │
     │───────────────────>│                     │
     │                    │                     │
     │                    │ 2. Create Order     │
     │                    │────────────────────>│
     │                    │                     │
     │                    │ 3. Order Details    │
     │                    │<────────────────────│
     │                    │                     │
     │ 4. Order ID +      │                     │
     │    Amount          │                     │
     │<───────────────────│                     │
     │                    │                     │
     │ 5. Open Razorpay   │                     │
     │    Checkout        │                     │
     │───────────────────────────────────────>  │
     │                    │                     │
     │                    │  6. Process Payment │
     │                    │                     │
     │ 7. Payment Success │                     │
     │    (payment_id +   │                     │
     │     signature)     │                     │
     │<───────────────────────────────────────  │
     │                    │                     │
     │ 8. Verify Payment  │                     │
     │───────────────────>│                     │
     │                    │                     │
     │                    │ 9. Verify Signature │
     │                    │   (Server-side)     │
     │                    │                     │
     │                    │ 10. Update Database │
     │                    │     (Payment status,│
     │                    │      Enroll course) │
     │                    │                     │
     │ 11. Success        │                     │
     │     Response       │                     │
     │<───────────────────│                     │
     │                    │                     │
     │                    │ 12. Webhook         │
     │                    │<────────────────────│
     │                    │                     │
```

### **Payment Security**

1. **Signature Verification:**

```javascript
const generatedSignature = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  .digest("hex");

if (generatedSignature !== razorpaySignature) {
  throw new Error("Invalid payment signature");
}
```

2. **Webhook Security:**

```javascript
const webhookSignature = req.headers["x-razorpay-signature"];
const generatedSignature = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(JSON.stringify(req.body))
  .digest("hex");
```

---

## 🔔 Notification System

### **Multi-Channel Notification Service**

#### **Email (via Nodemailer + Gmail)**

```javascript
// Configuration
{
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS  // App-specific password
  }
}
```

**Email Templates:**

- Welcome Email (Rich HTML with course details)
- Payment Reminder (3 days, 1 day before)
- Overdue Notice
- Course Lock/Unlock Notification
- Payment Receipt

#### **SMS (via Twilio)**

```javascript
await client.messages.create({
  body: messageContent,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: normalizedPhoneNumber,
});
```

#### **WhatsApp (via Twilio)**

```javascript
await client.messages.create({
  body: messageContent,
  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
  to: `whatsapp:${normalizedPhoneNumber}`,
});
```

### **Notification Tracking**

All notifications are logged in the EMI Plan's `notifications` array:

```javascript
{
  type: "reminder",
  sentAt: new Date(),
  channel: "gmail",
  status: "sent",
  metadata: {
    dueDate: "2025-12-05",
    amount: 1200
  }
}
```

---

## 🔐 Authentication & Authorization

### **JWT Token Structure**

```javascript
{
  id: user._id,
  email: user.email,
  role: user.role,
  iat: timestamp,
  exp: timestamp + 5days
}
```

### **Authentication Middleware**

```javascript
// Public routes (no auth required)
const PUBLIC_ROUTES = [
  "/register",
  "/verify-otp",
  "/login",
  "/courses/user-view",
  // ...
];

// Protected routes (auth required)
app.use(verifyToken); // Applied after public routes
```

### **Role-Based Access Control**

- **User Role:** Access to enrolled courses, payments, exams
- **Admin Role:** Full course management, user management

### **Course Access Middleware**

```javascript
checkCourseAccessMiddleware:
1. Check full payment
2. Check EMI plan status
3. Check EMI overdue
4. Return access decision
```

---

## 🧪 Testing

### **Test Structure**

```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   ├── payment.test.js
│   └── emi.test.js
└── e2e/
    └── user-flow.test.js
```

### **Running Tests**

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# CI/CD mode
npm run test:ci
```

### **Test Configuration (package.json)**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

---

## 🚀 Deployment

### **Production Checklist**

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use production MongoDB connection string
- [ ] Use Razorpay live keys
- [ ] Configure proper AWS S3 bucket permissions
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables on hosting platform
- [ ] Configure logging and monitoring
- [ ] Set up automated backups for MongoDB
- [ ] Configure rate limiting
- [ ] Enable security headers

### **Deployment Options**

#### **1. Heroku**

```bash
heroku create learnly-backend
heroku config:set NODE_ENV=production
heroku config:set MONGO_URL=<your_mongo_url>
# Set other env variables
git push heroku main
```

#### **2. AWS EC2**

```bash
# SSH into EC2
ssh -i keypair.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd learnly_backend
npm install --production
pm2 start server.js --name learnly-backend
pm2 startup
pm2 save
```

#### **3. Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]
```

```bash
docker build -t learnly-backend .
docker run -p 8000:8000 --env-file .env learnly-backend
```

#### **4. DigitalOcean / Vercel / Railway**

Follow platform-specific deployment guides. Ensure:

- Set all environment variables
- Configure build commands: `npm install`
- Set start command: `node server.js`

### **Production Environment Variables**

```env
NODE_ENV=production
PORT=8000
MONGO_URL=<production_mongodb_url>
JWT_SECRET=<strong_secret_key>
# ... other production credentials
```

### **Monitoring & Logging**

Consider integrating:

- **PM2** for process management
- **Winston** for advanced logging
- **Sentry** for error tracking
- **New Relic** / **DataDog** for performance monitoring
- **LogRocket** for user session recording

---

## 🎯 Best Practices

### **1. Code Organization**

- ✅ Separate concerns: Routes → Controllers → Services → Models
- ✅ Use meaningful variable and function names
- ✅ Keep controllers thin, business logic in services
- ✅ Use async/await instead of callbacks

### **2. Security**

- ✅ Never commit `.env` file
- ✅ Use strong JWT secrets
- ✅ Implement rate limiting (consider `express-rate-limit`)
- ✅ Validate all user inputs
- ✅ Sanitize data before database operations
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated

### **3. Database**

- ✅ Use indexes for frequently queried fields
- ✅ Implement proper error handling for database operations
- ✅ Use transactions for multi-document updates
- ✅ Regularly backup database
- ✅ Monitor database performance

### **4. Error Handling**

- ✅ Use try-catch blocks
- ✅ Return consistent error responses
- ✅ Log errors with context
- ✅ Don't expose sensitive information in error messages

### **5. Performance**

- ✅ Use lean() for read-only queries
- ✅ Implement pagination for large datasets
- ✅ Cache frequently accessed data
- ✅ Optimize database queries
- ✅ Use compression middleware

### **6. API Design**

- ✅ Follow RESTful conventions
- ✅ Use proper HTTP status codes
- ✅ Version your APIs (/api/v1/)
- ✅ Document all endpoints
- ✅ Implement request validation

### **7. Git Workflow**

- ✅ Use meaningful commit messages
- ✅ Create feature branches
- ✅ Review code before merging
- ✅ Use .gitignore properly
- ✅ Tag releases

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Getting Started**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

### **Pull Request Process**

1. Ensure code passes all tests
2. Update README if needed
3. Add comments to complex logic
4. Request review from maintainers

### **Reporting Issues**

- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Add relevant logs/screenshots

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team & Support

**Developed by:** Logical Minds IT Solutions  
**Contact:** logicalmindsit.careers@gmail.com

### **Support**

- 📧 Email: logicalmindsit.careers@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/logicalmindsit/learnly_backend/issues)
- 📖 Documentation: This README

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Razorpay](https://razorpay.com/) - Payment gateway
- [AWS S3](https://aws.amazon.com/s3/) - File storage
- [Twilio](https://www.twilio.com/) - Communication API
- [Nodemailer](https://nodemailer.com/) - Email service

---

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** November 2025

### **Upcoming Features**

- [ ] Advanced analytics dashboard
- [ ] Bulk course enrollment
- [ ] Referral system
- [ ] Certificate generation
- [ ] Mobile app API support
- [ ] Multi-language support
- [ ] Advanced reporting

---

**Made with ❤️ by Logical Minds IT Solutions**
