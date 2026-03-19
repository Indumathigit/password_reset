# Password Reset

A full stack password reset flow built with React, Node.js, Express, and MongoDB.

## Features
- Forgot password page
- Email verification using Nodemailer
- Reset password page
- Token expiry after 1 hour
- Password hashed using bcrypt

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Email: Nodemailer (Gmail)

## Frontend
- Deployed on Netlify

## Backend
- Deployed on Render

## How it works
1. User enters email on forgot password page
2. Server checks if user exists in database
3. If found, generates a random token and sends reset link to email
4. User clicks the link and enters new password
5. Server verifies token and updates password in database