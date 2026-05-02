MERN Task Management Application

 Overview

This is a full-stack Task Management Application built using the MERN stack (MongoDB, Express, React, Node.js).
It allows users to register, login, create projects, manage tasks, and track progress efficiently.
Tech Stack

Frontend
React (Vite),Axios, React Router

Backend

Node.js
Express.js
JWT Authentication

Database

 MongoDB Atlas

Deployment
Backend: Railway
Frontend: Railway
 Features

User Authentication (Register & Login using JWT) Project Management (Create, View, Delete Projects)
Task Management (Add, Update, Delete Tasks)
 REST API Integration
  Fully Deployed Application

 Live Demo

Frontend: https://your-frontend-url
Backend API: https://your-backend-url





 Environment Variables

Create a ".env" file in the backend:

MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key







 Running Locally

1. Clone the repo

git clone https://github.com/your-username/your-repo.git
cd Ethera_App

2. Backend setup

cd backend
npm install
npm start

3. Frontend setup

cd frontend
npm install
npm run dev

 API Endpoints

Auth

- POST "/api/auth/register"
- POST "/api/auth/login"

Projects

- GET "/api/projects"
- POST "/api/projects"
- DELETE "/api/projects/:id"

Tasks

- GET "/api/tasks"
- POST "/api/tasks"
- PUT "/api/tasks/:id"
- DELETE "/api/tasks/:id"

---

Challenges Faced

- Handling CORS issues during deployment
- Managing environment variables securely
- Fixing API routing and base URL mismatches
- Deploying Vite frontend correctly (dist vs build)

---

 Future Improvements

- Add task deadlines & reminders
- Implement role-based access
- Add UI enhancements
- Real-time updates using sockets

---

Author

Ashwini
Full Stack Developer (MERN)

---

License

This project is open-source and available under the MIT License.
