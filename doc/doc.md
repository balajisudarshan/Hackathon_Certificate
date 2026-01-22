# Digital Certificate Issuance & QR Verification System
(MERN Stack – Hackathon Implementation)

---

## 1. Overview

This system provides a secure way to issue, manage, and verify digital certificates.
Certificates are issued by authorized admins and verified publicly using a QR-based
verification mechanism backed by backend integrity checks.

The system is designed to:
- Prevent fake certificates
- Allow instant public verification
- Work even when certificates are shared offline (PDF / print)

---

## 2. Actors / Roles

### 2.1 Admin (Logged-in User)
- Represents issuing authority
- Can issue, view, and revoke certificates
- Requires authentication

### 2.2 Public User (Non-Logged-in)
- Anyone verifying a certificate
- No login required
- Read-only access

---

## 3. Core Concepts

### 3.1 Certificate (Logical)
A certificate is a record stored in the backend database.
It represents a claim made by the issuer.

### 3.2 Certificate (Visual)
A human-readable document (PDF / print / image) that contains:
- Certificate details
- Certificate ID
- QR code for verification

### 3.3 QR Code
- Contains a public verification URL
- Acts as a bridge from offline certificate to online verification
- Does NOT contain sensitive data

### 3.4 Hash
- Cryptographic fingerprint of certificate data
- Used to detect tampering
- Generated using SHA-256

---

## 4. System Architecture

Frontend (React)
→ Backend (Node + Express)
→ Database (MongoDB)

All verification logic resides on the backend.
Frontend is never trusted.

---

## 5. Certificate Lifecycle

1. Admin issues certificate
2. Certificate stored with hash
3. QR generated with verification URL
4. Certificate shared (PDF / print)
5. Public user scans QR
6. Backend verifies authenticity
7. Certificate may be revoked or expired later

---

## 6. Database Design

### 6.1 Certificate Collection

```json
{
  "certificateId": "CERT-9A82X",
  "name": "Ravi Kumar",
  "title": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "issueDate": "2026-01-10",
  "expiryDate": "2028-01-10",
  "hash": "sha256_hash_here",
  "status": "ISSUED",
  "qrCodeUrl": "https://yourdomain.com/verify/CERT-9A82X",
  "createdAt": "2026-01-10T10:15:30Z"
}
Status Values
ISSUED

REVOKED

EXPIRED

6.2 Admin Collection
{
  "email": "admin@example.com",
  "password": "bcrypt_hashed_password"
}
7. API Routes
Base URL:

/api
8. Authentication Routes (Admin)
8.1 Admin Login
Route

POST /api/auth/login
Request

{
  "email": "admin@example.com",
  "password": "password123"
}
Response

{
  "token": "jwt_token_here"
}
Purpose

Authenticates admin

Issues JWT for protected routes

9. Admin Routes (Protected)
All routes below require:

Authorization: Bearer <JWT>
9.1 Issue Certificate
Route

POST /api/certificates
Request

{
  "name": "Ravi Kumar",
  "title": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "issueDate": "2026-01-10",
  "expiryDate": "2028-01-10"
}
Backend Logic

Generate unique certificateId

Create certificate data object

Generate SHA-256 hash

Store certificate in DB

Generate QR with verification URL

Response

{
  "certificateId": "CERT-9A82X",
  "qrCodeUrl": "https://yourdomain.com/verify/CERT-9A82X",
  "status": "ISSUED"
}
9.2 Get All Certificates (Admin Dashboard)
Route

GET /api/certificates
Response

[
  {
    "certificateId": "CERT-9A82X",
    "name": "Ravi Kumar",
    "title": "Full Stack Web Development",
    "status": "ISSUED"
  }
]
9.3 Get Certificate by ID (Admin View)
Route

GET /api/certificates/:certificateId
Purpose

View full certificate details

Used in admin dashboard

9.4 Revoke Certificate
Route

PUT /api/certificates/:certificateId/revoke
Response

{
  "status": "REVOKED",
  "message": "Certificate revoked successfully"
}
Effect

Certificate becomes invalid immediately

All future verifications fail

10. Public Routes (No Login Required)
10.1 Verify Certificate (QR / Manual)
Route

GET /api/verify/:certificateId
Verification Logic (Backend)

Check if certificate exists

Check status (not revoked)

Check expiry date

Recalculate hash

Compare hashes

Response – Valid

{
  "certificateId": "CERT-9A82X",
  "name": "Ravi Kumar",
  "title": "Full Stack Web Development",
  "issuer": "ABC Institute of Technology",
  "status": "VALID"
}
Response – Revoked

{
  "status": "REVOKED"
}
Response – Expired

{
  "status": "EXPIRED"
}
Response – Tampered

{
  "status": "TAMPERED"
}
11. QR Verification Flow
User scans QR

Browser opens /verify/:certificateId

Frontend loads verification page

Frontend calls /api/verify/:certificateId

Backend performs all checks

Result displayed to user

QR is only an entry point.
All trust decisions happen on the backend.

12. Security Design
JWT for admin authentication

bcrypt for password hashing

SHA-256 for certificate integrity

No sensitive data in QR

Public routes are read-only

13. Hackathon Scope (2 Days)
Day 1
Backend APIs

Database schema

Hashing & verification logic

Admin login

Day 2
Admin dashboard

Certificate UI

QR generation

Public verification page

Demo flow

14. Key Justification
QR verification is included because it enables:

Instant verification

Offline certificate sharing

Zero manual input

Real-world usability

Security is enforced by backend validation, not by QR itself.

15. Conclusion
This system provides a practical, secure, and scalable approach to digital certificate
issuance and verification. It balances real-world usability with strong backend trust
mechanisms and is feasible to implement within a hackathon timeframe.


---



