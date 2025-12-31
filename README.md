# 🔐 Passwordless Authentication System

This project is a backend authentication system that allows users to log in **without using passwords**.  
Instead of passwords, users authenticate using a **one-time OTP sent to their email**, making the system more secure and user-friendly.

The project focuses on **security, clean backend architecture, and real-world authentication practices**.

---

## ✨ What This Project Does

- Allows users to log in using **email-based OTP**
- OTPs are **hashed and stored securely**
- OTPs expire automatically after a configurable time
- Prevents OTP reuse for better security
- Generates **JWT access and refresh tokens**
- Tracks user sessions and devices
- Sends OTPs via email using **Nodemailer**
- Uses environment variables to protect sensitive data

---

## 🧠 Why Passwordless Authentication?

Traditional passwords are often:
- Reused across platforms
- Easy to forget
- Vulnerable to phishing attacks

This system removes passwords completely and replaces them with **time-based OTP authentication**, which improves both **security and user experience**.

---

## 🛠️ Technologies Used

- **Node.js** – Backend runtime
- **Express.js** – API framework
- **MongoDB** – Database
- **JWT** – Authentication tokens
- **bcrypt** – OTP hashing
- **Nodemailer** – Email service
- **dotenv** – Environment variable management

---

## 📁 Project Structure

passwordless-auth/
├── config/
│ └── db.js
├── controllers/
│ └── authController.js
├── models/
│ ├── User.js
│ ├── OTP.js
│ └── Session.js
├── routes/
│ └── authRoutes.js
├── utils/
│ ├── sendOTP.js
│ └── tokenService.js
├── .gitignore
├── package.json
└── server.js

---

## 🔗 API Endpoints

### Send OTP

Request body:
```json
{
  "email": "user@gmail.com"
}

POST /api/auth/verify-otp

{
  "email": "user@gmail.com",
  "otp": "123456",
  "device": "Chrome-Windows"
}
