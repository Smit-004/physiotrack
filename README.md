# PhysioTrack 🩺

A physiotherapy recovery tracker built with the MERN stack. Users log daily
exercises and pain levels, and the app turns those logs into a pain trend chart,
a streak counter and a recovery score, and warns when pain keeps rising.

> Tracking tool only. Not medical advice.

## Features
- Secure register/login (JWT in httpOnly cookie, bcrypt password hashing)
- Add, edit, delete and filter daily logs by body part
- Dashboard: pain trend chart, streak, recovery score (0 to 100)
- Rule-based red-flag alert (rising pain or very high pain)
- Every database query is scoped to the logged-in user

## Tech stack
React, Vite, React Router, Axios, Tailwind CSS, Recharts, Node.js, Express,
MongoDB (Mongoose), JWT, Zod

## Run locally
```bash
# Backend
cd server
npm install
# create .env (see below)
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

`server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Screenshots
<!-- (add screenshots of Dashboard and Logs here) -->