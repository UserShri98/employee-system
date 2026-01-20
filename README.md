* Setup

Prerequisites

Node.js (v22 or above)
MongoDB (local instance or MongoDB Atlas)
npm

Backend Setup
cd backend
npm install

Frontend Setup
cd frontend
npm install
npm run dev

* Architecture

Frontend (React + Vite)
        ↓
REST API (Express.js)
        ↓
Database (MongoDB)

Breakdown

Frontend
React with Vite, using role-based routing and protected pages. Tailwind CSS is used for a responsive UI.

Backend
Node.js with Express providing REST APIs. Authentication is handled using JWT, and access is controlled based on user roles.

Database
MongoDB with Mongoose ODM for schema definition and data persistence.

* Feature List
Common Features (All Users)

Login & Logout

Role-based dashboard

Punch In / Punch Out attendance

Apply for leave

View salary details

View holiday calendar

Team Lead

View team attendance

View team leave requests

Approve or reject leave requests of team members

Owner

All team lead permissions

Create and delete employees

View attendance of all employees

Approve or reject all leave requests

Create and manage holidays

View salary records for all employees

* Data Flow
Authentication Flow
  User enters email & password
        ↓
  Backend validates credentials
        ↓
  JWT token generated
        ↓
  Token stored in browser (localStorage)
        ↓
  Token sent with every authenticated API request

Attendance Flow
  Employee clicks "Punch In"
        ↓
  Request sent to backend with timestamp
        ↓
  System checks if attendance already exists for the day
        ↓
  Attendance record saved
        ↓
  Success response shown on UI

Leave Flow
  Employee selects leave dates & reason
        ↓
  Backend calculates leave days (excluding weekends & holidays)
        ↓
  Leave created with status "PENDING"
        ↓
  Team Lead / Owner reviews request
        ↓
  Approval or rejection updates leave status

Salary Calculation Flow
  Monthly salary calculation triggered
        ↓
  Working days calculated (Mon–Fri, excluding holidays)
        ↓
  Attendance & approved leaves counted
        ↓
  Absence deduction calculated
        ↓
  Final salary computed
        ↓
  Salary record saved in database

  * Live URL 

   https://employee-system-kappa.vercel.app/