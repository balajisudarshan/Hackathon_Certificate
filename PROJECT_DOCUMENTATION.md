# Digital Certificate Issuance & QR Verification System

## Complete Project Documentation

**Project Type:** MERN Stack (MongoDB, Express.js, React, Node.js)  
**Purpose:** Secure issuance, management, and public verification of digital certificates  
**Status:** Hackathon Implementation (2-day project)  
**Date:** January 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Key Features](#key-features)
5. [Core Concepts](#core-concepts)
6. [Project Structure](#project-structure)
7. [Database Design](#database-design)
8. [API Documentation](#api-documentation)
9. [Frontend Pages & Components](#frontend-pages--components)
10. [Security Design](#security-design)
11. [Setup & Installation](#setup--installation)
12. [Running the Project](#running-the-project)
13. [Certificate Lifecycle](#certificate-lifecycle)
14. [QR Verification Flow](#qr-verification-flow)
15. [Middleware & Utilities](#middleware--utilities)
16. [Cron Jobs](#cron-jobs)

---

## Project Overview

This system provides a **secure, scalable approach to digital certificate issuance and verification**. It addresses the need for:

- **Preventing fake certificates** through cryptographic hashing and verification
- **Instant public verification** via QR codes without requiring login
- **Offline certificate sharing** through PDF/print formats with embedded QR codes
- **Real-world usability** with a balance between security and ease of use

### Target Users

1. **Admin (Issuing Authority)** - Can issue, view, revoke, and manage certificates
2. **Public Users (Non-Logged-in)** - Can verify certificates using QR codes or manual lookup

### Key Innovation

The system uses **backend-enforced security** where all trust decisions are made on the server, not the client or QR code itself. The QR code is merely an entry point for verification.

---

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js (v5.2.1)
- **Database:** MongoDB with Mongoose (v9.1.5)
- **Authentication:** JWT (jsonwebtoken v9.0.3)
- **Password Hashing:** bcrypt & bcryptjs
- **Rate Limiting:** express-rate-limit
- **Validation:** express-validator
- **Task Scheduling:** node-cron (v4.2.1)
- **Environment:** dotenv
- **CORS:** cors middleware
- **Crypto:** Node.js built-in crypto module

### Frontend

- **Framework:** React (v19.2.0) with React Router (v7.12.0)
- **Build Tool:** Vite (rolldown-vite)
- **Styling:** Tailwind CSS (v4.1.18) with Vite plugin
- **UI Components:** Radix UI (labels, selects, separators, slots)
- **HTTP Client:** axios
- **QR Code:** qrcode library (v1.5.4)
- **Icons:** lucide-react
- **Notifications:** react-hot-toast
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Linter:** ESLint (v9.39.1)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Login      │  │   Dashboard  │  │   Verify     │   │
│  │   Page       │  │   (Admin)    │  │   Certificate│   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTP/REST ↓
┌─────────────────────────────────────────────────────────┐
│         Backend (Node.js + Express.js)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Routes (Auth & Certificate)                        │ │
│  │ ┌──────────────────┐  ┌──────────────────────────┐ │ │
│  │ │ /api/auth/*      │  │ /api/certificates/*      │ │ │
│  │ │ - login          │  │ - issue (POST)           │ │ │
│  │ │ - register       │  │ - all (GET)              │ │ │
│  │ │ - getAllUsers    │  │ - verify/:certId (GET)   │ │ │
│  │ │                  │  │ - :certId (GET)          │ │ │
│  │ │                  │  │ - status/:certId (PUT)   │ │ │
│  │ └──────────────────┘  └──────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Middleware                                         │ │
│  │ - Authentication (JWT)                             │ │
│  │ - Rate Limiting                                    │ │
│  │ - Validation                                       │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Controllers & Services                             │ │
│  │ - Certificate Logic (Hash, Verify, Update)         │ │
│  │ - Authentication Logic                             │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Cron Jobs                                          │ │
│  │ - Certificate Expiry Check (Daily)                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓ MongoDB Driver ↓
┌─────────────────────────────────────────────────────────┐
│            MongoDB Database                             │
│  ┌──────────────────────┐  ┌─────────────────────────┐  │
│  │ Certificate Collection│  │ User Collection        │  │
│  │ - certId (Unique)    │  │ - email (Unique)        │  │
│  │ - name               │  │ - password (Hashed)     │  │
│  │ - course             │  │ - name                  │  │
│  │ - issuer             │  │ - organization          │  │
│  │ - dateOfIssue        │  │ - createdAt             │  │
│  │ - hashValue          │  └─────────────────────────┘  │
│  │ - status             │                               │
│  │ - expiryDate         │                               │
│  └──────────────────────┘                               │
└─────────────────────────────────────────────────────────┘
```

---

## Key Features

### Admin Features

- ✅ **User Registration & Login** - Admins can register with email, name, and organization
- ✅ **Issue Certificates** - Create new certificates with auto-generated unique IDs
- ✅ **View All Certificates** - Dashboard with pagination, filtering by issuer/course
- ✅ **View Certificate Details** - Full information about any issued certificate
- ✅ **Revoke Certificates** - Immediately invalidate certificates
- ✅ **Manage Status** - Update certificate status (active/revoked/expired)

### Public Features (No Login Required)

- ✅ **Verify Certificate via QR** - Scan QR code to instantly verify
- ✅ **Manual Certificate Lookup** - Verify by entering certificate ID
- ✅ **Tamper Detection** - Detect if certificate data has been altered
- ✅ **Expiry Status** - Check if certificate has expired
- ✅ **Revocation Status** - Verify if certificate has been revoked

### System Features

- ✅ **Unique Certificate IDs** - Format: CERT-YYYY-NNNNNN (e.g., CERT-2026-000001)
- ✅ **SHA-256 Hashing** - Cryptographic integrity verification
- ✅ **JWT Authentication** - Secure admin session management (1-day expiry)
- ✅ **Rate Limiting** - Prevent abuse and DDoS attacks
- ✅ **Automated Expiry** - Cron job checks daily for expired certificates
- ✅ **QR Code Generation** - Embedded in frontend for offline sharing
- ✅ **CORS Support** - Cross-origin requests enabled

---

## Core Concepts

### 1. Certificate (Logical Record)

A certificate stored in MongoDB representing a claim made by the issuing authority.

**Example:**

```json
{
  "certId": "CERT-2026-000001",
  "name": "Ravi Kumar",
  "course": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "dateOfIssue": "2026-01-10",
  "hashValue": "abc123def456...",
  "status": "active",
  "expiryDate": "2028-01-10"
}
```

### 2. Certificate (Visual Document)

A PDF or print document containing:

- Certificate details (name, course, issuer, dates)
- Certificate ID (CERT-YYYY-NNNNNN)
- QR code linking to verification URL

### 3. Hash Value

A SHA-256 cryptographic fingerprint that ensures:

- **Integrity:** Any change to certificate data invalidates the hash
- **Non-repudiation:** Admin cannot deny issuing the certificate
- **Tamper Detection:** Recalculated hash must match stored hash

**Hashing Formula:**

```
hash = SHA-256(certId | name | course | issuer | dateOfIssue)
```

### 4. QR Code

Contains: `https://yourdomain.com/verify/CERT-2026-000001`

**Purpose:**

- Entry point for public verification
- Works offline (in PDF/print)
- No sensitive data contained
- Requires backend validation to trust

### 5. Status Values

- **active** - Certificate is valid and can be verified
- **revoked** - Certificate has been revoked by admin
- **expired** - Certificate has passed its expiry date

---

## Project Structure

```
Hackathon_Certificate/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js         # Login, register, get users
│   │   └── certificate.controller.js  # Issue, verify, manage certificates
│   ├── cron/
│   │   └── certificateExpiry.js       # Daily expiry check job
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── ratelimiter.middleware.js  # Rate limiting
│   │   └── validate.middleware.js     # Validation error handler
│   ├── models/
│   │   ├── Certificate.model.js       # Mongoose schema for certificates
│   │   └── User.model.js              # Mongoose schema for users
│   ├── routes/
│   │   ├── auth.route.js              # Auth endpoints
│   │   └── certificate.route.js       # Certificate endpoints
│   ├── utils/
│   │   └── certificateHash.js         # Hash generation & verification
│   ├── validators/
│   │   └── auth.validator.js          # Input validation rules
│   ├── package.json                   # Backend dependencies
│   └── server.js                      # Express app initialization
│
├── frontend/
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── assets/                    # Images, fonts, etc.
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   └── ui/
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       └── spinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication state
│   │   ├── lib/
│   │   │   └── utils.js               # Utility functions
│   │   ├── pages/
│   │   │   ├── AddCertificate.jsx     # Issue new certificate
│   │   │   ├── AdminDashboard.jsx     # Admin panel
│   │   │   ├── Login.jsx              # Admin login
│   │   │   ├── QrVerification.jsx     # QR code verification
│   │   │   ├── VerifyCertificate.jsx  # Public verification
│   │   │   └── ViewCertificate.jsx    # Certificate details
│   │   ├── App.jsx                    # Main app component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── components.json
│   ├── jsconfig.json
│   └── README.md
│
├── doc/
│   └── doc.md                         # Original project documentation
├── readme.md                          # Project title
└── PROJECT_DOCUMENTATION.md           # This file
```

---

## Database Design

### 1. User Collection

**Purpose:** Store admin user accounts for authentication

**Schema:**

```javascript
{
  _id: ObjectId,
  name: String (required),
  organization: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  createdAt: Date (auto)
}
```

**Example:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Aditya Sharma",
  "organization": "ABC Institute of Technology",
  "email": "aditya@abcinstitute.edu",
  "password": "$2a$10$...",
  "createdAt": "2026-01-10T08:30:00Z"
}
```

### 2. Certificate Collection

**Purpose:** Store issued certificates with integrity verification

**Schema:**

```javascript
{
  _id: ObjectId,
  certId: String (required, unique, pattern: CERT-YYYY-NNNNNN),
  name: String (required) - Recipient name,
  course: String (required) - Course/Achievement title,
  issuer: String (required) - Issuing organization,
  dateOfIssue: Date (required) - When certificate was issued,
  hashValue: String (required) - SHA-256 hash for integrity,
  signatureUrl: String (optional) - Signature image URL,
  qrCodeUrl: String (optional) - QR verification URL,
  startingDate: Date (optional) - Course start date,
  endingDate: Date (optional) - Course end date,
  expiryDate: Date (optional) - Certificate expiry date,
  expired: Boolean (default: false) - Expiry flag,
  status: String (enum: ["active", "revoked", "expired"], default: "active"),
  createdAt: Date (auto)
}
```

**Example:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "certId": "CERT-2026-000001",
  "name": "Ravi Kumar",
  "course": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "dateOfIssue": "2026-01-10T10:15:30Z",
  "hashValue": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "qrCodeUrl": "https://yourdomain.com/verify/CERT-2026-000001",
  "startingDate": "2025-01-10T00:00:00Z",
  "endingDate": "2025-12-20T00:00:00Z",
  "expiryDate": "2028-01-10T00:00:00Z",
  "expired": false,
  "status": "active"
}
```

### Indexes

- `certId` - Unique index for fast lookups
- `email` (User) - Unique index for authentication
- `status` - For filtering queries
- `dateOfIssue` - For sorting certificates

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

---

## Authentication API

### 1. Admin Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successful"
}
```

**Response (Failure - 400/404/500):**

```json
{
  "message": "Invalid credentials" | "User not found" | "Server Error"
}
```

**JWT Token Payload:**

```json
{
  "id": "user_id",
  "name": "Admin Name",
  "organization": "Org Name",
  "iat": 1674950000,
  "exp": 1675036400
}
```

**Token Duration:** 24 hours (1 day)

---

### 2. Admin Registration

**Endpoint:** `POST /auth/register`

**Request:**

```json
{
  "name": "Admin Name",
  "organization": "Organization Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success - 201):**

```json
{
  "message": "User registered successfully"
}
```

**Response (Failure):**

```json
{
  "message": "User already exists" | "Please provide all fields" | "Server Error"
}
```

**Validation Rules:**

- Email must be valid and unique
- Password strength: Recommended 8+ characters
- All fields required

---

### 3. Get All Users

**Endpoint:** `GET /auth/getallusers`

**Response (Success - 200):**

```json
[
  {
    "_id": "user_id",
    "name": "Admin 1",
    "organization": "ABC Institute",
    "email": "admin1@example.com"
  },
  {
    "_id": "user_id_2",
    "name": "Admin 2",
    "organization": "XYZ Institute",
    "email": "admin2@example.com"
  }
]
```

**Note:** Password field is excluded for security

---

## Certificate API

### 4. Issue Certificate (Admin Only)

**Endpoint:** `POST /certificates/issue`

**Authentication:** Not required in current implementation (should be protected)

**Request:**

```json
{
  "name": "Ravi Kumar",
  "course": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "startingDate": "2025-01-10",
  "endingDate": "2025-12-20",
  "expiryDate": "2028-01-10"
}
```

**Response (Success - 201):**

```json
{
  "_id": "60d5ec49c1234567890abcd",
  "certId": "CERT-2026-000001",
  "name": "Ravi Kumar",
  "course": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "dateOfIssue": "2026-01-23T10:15:30.123Z",
  "hashValue": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "startingDate": "2025-01-10T00:00:00.000Z",
  "endingDate": "2025-12-20T00:00:00.000Z",
  "expiryDate": "2028-01-10T00:00:00.000Z",
  "expired": false,
  "status": "active"
}
```

**Response (Failure):**

```json
{
  "message": "All fields are required" | "Invalid date format" | "Server Error"
}
```

**Features:**

- Auto-generates unique certId with format: CERT-YYYY-NNNNNN
- Creates SHA-256 hash of certificate data
- Stores in MongoDB with timestamp

---

### 5. Get All Certificates

**Endpoint:** `GET /certificates/all`

**Query Parameters:**

```
?page=1&limit=10&issuer=ABC Institute&course=Web Development&valid=true
```

**Response (Success - 200):**

```json
{
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "data": [
    {
      "certId": "CERT-2026-000001",
      "name": "Ravi Kumar",
      "course": "Full Stack Web Development",
      "issuer": "ABC Institute",
      "status": "active",
      "dateOfIssue": "2026-01-10T10:15:30Z"
    }
    // ... more certificates
  ]
}
```

**Features:**

- Pagination support (default: page 1, limit 10)
- Filter by issuer, course, validity status
- Sorted by dateOfIssue (newest first)

---

### 6. Verify Certificate (Public)

**Endpoint:** `GET /certificates/verify/:certId`

**Example:** `GET /certificates/verify/CERT-2026-000001`

**Response (Valid Certificate - 200):**

```json
{
  "certificate": {
    "certId": "CERT-2026-000001",
    "name": "Ravi Kumar",
    "course": "Full Stack Web Development",
    "issuer": "ABC Institute of Technology",
    "dateOfIssue": "2026-01-10T10:15:30Z",
    "expiryDate": "2028-01-10T00:00:00Z",
    "status": "active",
    "expired": false
  },
  "valid": true
}
```

**Response (Tampered Certificate):**

```json
{
  "certificate": {
    /* ... */
  },
  "valid": false
}
```

**Response (Certificate Not Found - 404):**

```json
{
  "message": "Certificate not found"
}
```

**Verification Steps:**

1. Look up certificate by certId
2. Recalculate hash using: SHA-256(certId|name|course|issuer|dateOfIssue)
3. Compare recalculated hash with stored hash
4. Check status (not revoked)
5. Check expiry date
6. Return detailed result

---

### 7. Get Certificate by ID

**Endpoint:** `GET /certificates/:certId`

**Example:** `GET /certificates/CERT-2026-000001`

**Response (Success - 200):**

```json
{
  "_id": "60d5ec49c1234567890abcd",
  "certId": "CERT-2026-000001",
  "name": "Ravi Kumar",
  "course": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "dateOfIssue": "2026-01-10T10:15:30Z",
  "hashValue": "e3b0c44...",
  "startingDate": "2025-01-10T00:00:00Z",
  "endingDate": "2025-12-20T00:00:00Z",
  "expiryDate": "2028-01-10T00:00:00Z",
  "expired": false,
  "status": "active"
}
```

**Response (Not Found - 404):**

```json
{
  "message": "Certificate not found"
}
```

---

### 8. Update Certificate Status (Admin)

**Endpoint:** `PUT /certificates/status/:certId`

**Authentication:** Required (Bearer Token)

**Request:**

```json
{
  "status": "revoked"
}
```

**Valid Status Values:**

- `active` - Certificate is valid
- `revoked` - Certificate has been revoked
- `expired` - Certificate has expired

**Response (Success - 200):**

```json
{
  "message": "Certificate status updated successfully"
}
```

**Response (Invalid Status):**

```json
{
  "message": "Invalid status value"
}
```

**Response (Already Expired):**

```json
{
  "message": "Certificate is already expired"
}
```

---

## Frontend Pages & Components

### Page Structure

#### 1. Login Page (`/login`)

**File:** `frontend/src/pages/Login.jsx`

**Purpose:** Admin authentication

**Features:**

- Email and password input fields
- Form validation
- Error handling with toast notifications
- Stores JWT token in localStorage
- Redirects to admin dashboard on success

**Components Used:**

- Input, Button, Label (from ui/)
- AuthContext for state management

---

#### 2. Add Certificate Page (`/`)

**File:** `frontend/src/pages/AddCertificate.jsx`

**Purpose:** Issue new certificates (Admin)

**Form Fields:**

- Recipient Name (required)
- Course/Title (required)
- Issuer Organization (required)
- Starting Date (optional)
- Ending Date (optional)
- Expiry Date (optional)

**Features:**

- Form validation
- Auto-generates unique certificate ID
- Success notification with certificate details
- Displays QR code for sharing

---

#### 3. Admin Dashboard (`/admin`)

**File:** `frontend/src/pages/AdminDashboard.jsx`

**Purpose:** View and manage issued certificates

**Features:**

- List all issued certificates with pagination
- Search and filter by issuer/course
- View certificate details
- Revoke certificates
- Mark as expired
- Update certificate status

---

#### 4. Verify Certificate (`/verify/:id`)

**File:** `frontend/src/pages/VerifyCertificate.jsx`

**Purpose:** Manual certificate verification by certificate ID

**Features:**

- Input certificate ID
- Displays verification result
- Shows certificate details if valid
- Indicates tampering, revocation, or expiry
- Works for public users (no login required)

---

#### 5. QR Verification (`/qr/verify/:certId`)

**File:** `frontend/src/pages/QrVerification.jsx`

**Purpose:** Verify certificate via QR code

**Flow:**

1. User scans QR code (automatically redirects to this page)
2. Certificate ID extracted from URL
3. Backend verification performed
4. Result displayed

---

#### 6. View Certificate (`/view/:certId`)

**File:** `frontend/src/pages/ViewCertificate.jsx`

**Purpose:** Display full certificate details and QR code

**Displays:**

- Recipient name
- Course/achievement
- Issuer organization
- Dates (issue, expiry)
- Verification status
- QR code for sharing
- Download/Print option

---

### Shared Components

#### Navbar (`frontend/src/components/Navbar.jsx`)

- Navigation links to all pages
- User authentication status
- Logout functionality

#### UI Components (`frontend/src/components/ui/`)

- **button.jsx** - Reusable button component
- **input.jsx** - Reusable input field
- **label.jsx** - Form labels
- **card.jsx** - Card container
- **select.jsx** - Dropdown selector
- **badge.jsx** - Status badges
- **separator.jsx** - Visual dividers
- **spinner.jsx** - Loading indicator

All UI components use Radix UI primitives and Tailwind CSS.

#### AuthContext (`frontend/src/context/AuthContext.jsx`)

- Global authentication state management
- JWT token storage/retrieval
- Login/logout logic
- User info persistence

#### Utils (`frontend/src/lib/utils.js`)

- Helper functions (cn() for className merging, etc.)
- API call utilities
- Date formatting functions

---

## Security Design

### 1. Authentication Security

**JWT Implementation:**

- Symmetric signing with HS256 algorithm
- 24-hour token expiry
- Payload contains: user ID, name, organization
- Token stored in localStorage (consider using httpOnly cookies for production)

**Password Security:**

- Bcrypt hashing with salt rounds (10)
- Never stored in plain text
- Passwords never returned in API responses

### 2. Certificate Integrity

**SHA-256 Hashing:**

```
Hash = SHA-256(certId | name | course | issuer | dateOfIssue)
```

**Why This Works:**

- Any change to certificate data changes the hash
- Impossible to forge without private key
- Deterministic (same data = same hash)
- Difficult to reverse (cryptographically secure)

**Verification Process:**

1. Retrieve certificate from database
2. Recalculate hash with same formula
3. Compare with stored hash
4. If different → certificate tampered with
5. Return valid/invalid status

### 3. Rate Limiting

**Implementation:** express-rate-limit middleware

**Purpose:**

- Prevent brute force attacks on login
- Prevent certificate verification abuse
- DDoS mitigation

**Configuration:** (Check `backend/middleware/ratelimiter.middleware.js`)

### 4. Input Validation

**Tools:**

- express-validator for schema validation
- Custom middleware for validation error handling

**Validation Rules:**

- Email format and uniqueness
- Password strength
- Date formats
- Required field presence
- Status enum validation

### 5. Authorization Control

**Protected Routes:**

- `PUT /certificates/status/:certId` - Requires JWT token
- Admin-only operations checked via authMiddleware

**Public Routes:**

- `GET /certificates/verify/:certId` - No authentication needed
- `GET /certificates/all` - No authentication needed
- `GET /certificates/:certId` - No authentication needed

### 6. Database Security

**Best Practices:**

- MongoDB connection via connection string (URI in .env)
- No hardcoded credentials
- Password fields excluded from API responses
- Unique indexes on sensitive fields (email, certId)

### 7. CORS Security

**Enabled:** Cross-Origin Resource Sharing

- Frontend can communicate with backend from different origins
- Configure allowed origins in production

### 8. Environment Variables

**Sensitive Data Stored In `.env`:**

```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
PORT=5000
```

**Never commit .env file to version control**

---

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or cloud - MongoDB Atlas)
- Git

### Step 1: Clone/Setup Project

```bash
cd Hackathon_Certificate
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Environment Configuration

Create `.env` file in `backend/`:

```
MONGO_URI=mongodb://localhost:27017/certificate_db
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate_db

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

#### 2.3 Verify Dependencies

```bash
npm list
```

Should see:

- express@5.2.1
- mongoose@9.1.5
- jsonwebtoken@9.0.3
- bcryptjs@3.0.3
- cors@2.8.5
- express-validator@7.3.1
- express-rate-limit@8.2.1
- node-cron@4.2.1
- dotenv@17.2.3
- nodemon@3.1.11 (dev)

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Verify Vite Configuration

Check `vite.config.js` - should have:

- React plugin
- Tailwind CSS plugin
- Path alias for `@`

#### 3.3 Environment Configuration (Optional)

Create `.env` file in `frontend/` if needed for API endpoints:

```
VITE_API_URL=http://localhost:5000/api
```

#### 3.4 Verify Dependencies

```bash
npm list
```

Should see:

- react@19.2.0
- react-dom@19.2.0
- react-router-dom@7.12.0
- vite
- tailwindcss@4.1.18
- axios@1.13.2
- qrcode@1.5.4

### Step 4: MongoDB Setup

**Option A: Local MongoDB**

```bash
# Windows (with MongoDB installed)
mongod

# Or as service (Windows)
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to mongodb.com/atlas
2. Create free account and cluster
3. Get connection string
4. Add to `.env` file

---

## Running the Project

### Terminal 1: Backend Server

```bash
cd backend
npm run dev
```

Expected output:

```
> nodemon server.js

[nodemon] 3.1.11
[nodemon] to restart at any time, type `rs`
Database connected successfully
Server running on http://localhost:5000
```

### Terminal 2: Frontend Development Server

```bash
cd frontend
npm run dev
```

Expected output:

```
  VITE v7.2.5  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Access Application

Open browser:

```
http://localhost:5173
```

---

## Certificate Lifecycle

### State Diagram

```
┌─────────┐
│ CREATED │
└────┬────┘
     │
     ▼
┌─────────────┐
│   ACTIVE    │
│ (Default)   │
└──┬──────┬───┘
   │      │
   │      └─────────────────┐
   │                        │
   ▼                        ▼
┌─────────┐           ┌──────────┐
│ EXPIRED │           │ REVOKED  │
│ (Auto)  │           │ (Manual) │
└─────────┘           └──────────┘
```

### Lifecycle Steps

**1. Creation**

- Admin issues certificate
- Status: ACTIVE
- Hash created and stored
- QR code generated

**2. Validity Period**

- Certificate can be verified
- Verification returns: VALID
- Status: ACTIVE

**3. Automatic Expiry**

- Cron job runs daily at 00:00 UTC
- Checks expiryDate vs current time
- If expired: Status → EXPIRED
- Verification returns: EXPIRED

**4. Manual Revocation**

- Admin can revoke anytime
- Admin calls: PUT /certificates/status/:certId
- Status → REVOKED
- Verification returns: REVOKED

**5. Tamper Detection**

- If certificate data modified (in DB or transit)
- Hash verification fails
- Verification returns: INVALID/TAMPERED
- Status remains unchanged

### Example Timeline

```
Jan 1, 2026: Admin issues certificate
             Status: ACTIVE
             ExpiryDate: Jan 1, 2028

Jan 23, 2026: Public user verifies
              Verification: VALID

Mar 15, 2026: Admin revokes certificate
              Status: REVOKED
              Verification: REVOKED

Jan 2, 2028: Cron job auto-expires
             Status: EXPIRED
             Verification: EXPIRED
```

---

## QR Verification Flow

### Complete Flow Diagram

```
┌──────────────┐
│ User Scans   │
│ QR Code      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ QR Points to:                        │
│ https://yourdomain.com/verify/       │
│ CERT-2026-000001                     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Browser Opens Link                   │
│ Redirects to Frontend Page:          │
│ /qr/verify/CERT-2026-000001          │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Frontend (React)                     │
│ 1. Extracts certId from URL          │
│ 2. Shows loading spinner             │
│ 3. Calls backend verification API    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Backend Verification                 │
│ GET /api/certificates/verify/:certId │
│                                      │
│ Steps:                               │
│ 1. Find cert in database             │
│ 2. Recalculate SHA-256 hash          │
│ 3. Compare hashes                    │
│ 4. Check status (not revoked)        │
│ 5. Check expiry date                 │
│ 6. Return result                     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Display Results                      │
│                                      │
│ If Valid:                            │
│ - Show ✓ VALID                       │
│ - Display all details                │
│ - Show print/download option         │
│                                      │
│ If Revoked:                          │
│ - Show ✗ REVOKED                     │
│ - Hide details                       │
│                                      │
│ If Expired:                          │
│ - Show ⚠ EXPIRED                     │
│ - Show expiry date                   │
│                                      │
│ If Tampered:                         │
│ - Show ✗ INVALID                     │
│ - Warn user                          │
└──────────────────────────────────────┘
```

### Key Points

1. **QR Contains No Sensitive Data**
   - Only public verification URL
   - Certificate details NOT embedded
   - Can be safely shared

2. **No Trust in QR Code**
   - QR is just transport mechanism
   - All validation happens on backend
   - Frontend never trusted

3. **Works Without Login**
   - Public verification endpoint
   - No authentication required
   - Anyone can scan and verify

4. **Offline Capability**
   - Certificate printed with QR
   - QR code valid offline
   - But still needs internet to verify
   - Backend is single source of truth

---

## Middleware & Utilities

### 1. Auth Middleware (`backend/middleware/auth.middleware.js`)

**Purpose:** Protect routes requiring authentication

**Usage:**

```javascript
router.put("/status/:certId", authMiddleware, updateCertificateStatus);
```

**Process:**

```
Request → Extract Authorization Header
        → Split "Bearer <token>"
        → Verify JWT signature
        → Decode payload
        → Attach user to req.user
        → Call next()
        │
        ├─ Valid: Continue
        └─ Invalid: Return 401 Unauthorized
```

**JWT Header Format:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. Rate Limiter Middleware (`backend/middleware/ratelimiter.middleware.js`)

**Purpose:** Prevent abuse and DDoS attacks

**Features:**

- Limits requests per IP address
- Configurable time window and max requests
- Applied globally to all routes

**Configuration (typical):**

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
});

app.use(limiter);
```

---

### 3. Validation Middleware (`backend/middleware/validate.middleware.js`)

**Purpose:** Handle and format validation errors

**Usage:**

```javascript
const { registerValidator } = require("../validators/auth.validator");
router.post("/register", registerValidator, validate, register);
```

**Process:**

```
Request → Run validators
        → Collect errors
        → Format response
        → Return 400 with errors OR call next()
```

---

### 4. Auth Validator (`backend/validators/auth.validator.js`)

**Purpose:** Define validation rules for registration

**Fields Validated:**

- Email (valid format, unique)
- Password (strength requirements)
- Name (non-empty)
- Organization (non-empty)

**Example:**

```javascript
const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").notEmpty(),
  body("organization").notEmpty(),
];
```

---

### 5. Certificate Hash Utilities (`backend/utils/certificateHash.js`)

**Purpose:** Generate and verify certificate hashes

**Functions:**

**generateCertificateHash()**

```javascript
const hash = generateCertificateHash(certId, name, course, issuer, dateOfIssue);
// Returns: SHA-256 hex string
```

**verifyCertificate()**

```javascript
const isValid = await verifyCertificate(
  certId,
  name,
  course,
  issuer,
  dateOfIssue,
  storedHash,
);
// Returns: Boolean (true if valid, false if tampered)
```

**Implementation:**

```javascript
const generateHash = (certId, name, course, issuer, dateOfIssue) => {
  const dataString = `${certId}|${name}|${course}|${issuer}|${dateOfIssue}`;
  return crypto.createHash("sha256").update(dataString).digest("hex");
};
```

---

## Cron Jobs

### Certificate Expiry Job (`backend/cron/certificateExpiry.js`)

**Purpose:** Automatically mark certificates as expired

**Schedule:** Every day at 00:00 UTC (midnight)

**Cron Expression:**

```
"0 0 * * *"
 │ │ │ │ │
 │ │ │ │ └─ Day of week (*)
 │ │ │ └─── Month (*)
 │ │ └───── Day of month (*)
 │ └─────── Hour (0)
 └───────── Minute (0)
```

**Logic:**

```javascript
cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  // Find all certificates with expiryDate < now
  const expiredCerts = await Certificate.updateMany(
    { expiryDate: { $lt: now } },
    { isExpired: true },
  );

  console.log(`Marked ${expiredCerts.modifiedCount} certificates as expired`);
});
```

**Fields Updated:**

- `expired`: true
- `status`: "expired" (optional, depends on implementation)

**Error Handling:**

```javascript
catch (error) {
  console.error("Error marking certificates as expired:", error);
  // Continue running despite errors
}
```

### Activation

The cron job is initialized in `server.js`:

```javascript
require("./cron/certificateExpiry");
```

---

## Development Guidelines

### Adding New Features

#### Example: Add Certificate Validity Duration Field

**Step 1: Update Database Schema**

```javascript
// backend/models/Certificate.model.js
const CertificateSchema = new mongoose.Schema({
  // ... existing fields
  validityDays: {
    type: Number,
    default: 365,
  },
});
```

**Step 2: Update Controller**

```javascript
// backend/controllers/certificate.controller.js
const issueCertificate = async (req, res) => {
  const { validityDays } = req.body;
  // ... generate expiryDate based on validityDays
};
```

**Step 3: Update API Route**

```javascript
// Add in AddCertificate.jsx form
<input
  type="number"
  placeholder="Validity in days"
  value={validityDays}
  onChange={(e) => setValidityDays(e.target.value)}
/>
```

**Step 4: Test**

```bash
npm run dev (both terminals)
Test the new field in frontend
```

### Common Tasks

#### Generate Test Data

```javascript
// Quick script to create test certificates
const Certificate = require("./models/Certificate.model");

const testCerts = [
  {
    certId: "CERT-2026-000001",
    name: "Test User 1",
    course: "Web Development",
    issuer: "Test Institute",
    dateOfIssue: new Date(),
    hashValue: "test_hash_1",
    status: "active",
  },
];

await Certificate.insertMany(testCerts);
```

#### Test Verification

```bash
# In browser console or REST client:
curl http://localhost:5000/api/certificates/verify/CERT-2026-000001
```

#### Debug Hash Issues

```javascript
// Test hash generation
const crypto = require("crypto");
const data = "CERT-2026-000001|Ravi|Web Dev|ABC|2026-01-10";
const hash = crypto.createHash("sha256").update(data).digest("hex");
console.log("Generated hash:", hash);
```

---

## Troubleshooting

### Backend Issues

**Issue: "Cannot find module 'mongoose'"**

```bash
Solution: npm install mongoose
```

**Issue: "MongoDB connection timeout"**

```
Check:
1. MongoDB is running
2. MONGO_URI is correct
3. Network connectivity
4. IP whitelist (if using Atlas)
```

**Issue: "JWT_SECRET not found"**

```bash
Solution: Add JWT_SECRET to .env file
JWT_SECRET=mysecretkey123
```

### Frontend Issues

**Issue: "Module not found @"**

```bash
Solution: Check jsconfig.json has correct path alias
```

**Issue: "Cannot GET /api/..."**

```
Check:
1. Backend server is running
2. API endpoint exists
3. API_URL environment variable
4. CORS is enabled
```

### General Issues

**Issue: Port already in use**

```bash
Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

**Issue: Dependencies conflict**

```bash
Solution:
rm -rf node_modules package-lock.json
npm install
```

---

## Production Deployment Checklist

### Before Going Live

- [ ] Remove console.log statements
- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to strong random key
- [ ] Use MongoDB Atlas (cloud) instead of local
- [ ] Enable HTTPS
- [ ] Set up CORS with specific allowed origins
- [ ] Implement rate limiting properly
- [ ] Add error logging (e.g., Sentry)
- [ ] Set up database backups
- [ ] Add environment-based configuration
- [ ] Test all verification flows
- [ ] Document API for external use
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement request logging
- [ ] Set up monitoring/alerts
- [ ] Review security checklist

### Environment Variables for Production

```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<very_long_random_string>
PORT=5000
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Project Timeline (Hackathon - 2 Days)

### Day 1: Backend Development

- ✅ Set up Node.js + Express server
- ✅ Configure MongoDB connection
- ✅ Create User and Certificate schemas
- ✅ Implement authentication (Login/Register)
- ✅ Implement certificate issuance with hashing
- ✅ Implement verification endpoint
- ✅ Add rate limiting and validation
- ✅ Add CORS support

### Day 2: Frontend Development

- ✅ Set up React + Vite + Tailwind
- ✅ Create Login page
- ✅ Create Certificate issuance page
- ✅ Create Admin dashboard
- ✅ Create public verification page
- ✅ Implement QR code generation
- ✅ Create QR verification flow
- ✅ Add toast notifications
- ✅ Test complete flow

---

## Conclusion

This Digital Certificate Issuance & QR Verification System provides:

1. **Security** - Through hashing, JWT authentication, and backend validation
2. **Scalability** - Designed to handle thousands of certificates
3. **User Experience** - Simple QR scanning for instant verification
4. **Real-World Usability** - Works with printed/PDF certificates
5. **Maintainability** - Clean code structure with clear separation of concerns

The system successfully demonstrates:

- Full-stack MERN implementation
- Cryptographic security practices
- RESTful API design
- Modern React patterns
- Database design and optimization

Perfect for a 2-day hackathon project with potential for expansion to include:

- Email notifications
- Advanced analytics
- Multi-language support
- Mobile app
- Block chain integration
- Bulk certificate import
- Advanced filtering and search

---

## Contact & Support

For questions or issues:

1. Check troubleshooting section
2. Review API documentation
3. Check console for error messages
4. Refer to comments in source code
5. Review existing GitHub issues

---

**Document Version:** 1.0  
**Last Updated:** January 23, 2026  
**Status:** Production Ready for Hackathon
