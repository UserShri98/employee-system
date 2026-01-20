# Employee Management System (EMS) - Frontend

A modern, responsive web application for managing employees, attendance, leaves, and salaries built with React, Vite, and Tailwind CSS.

## Features

### For Employees
- **Dashboard**: Overview of personal attendance, leaves, and salary
- **Attendance**: Mark daily punch-in/out and view attendance history
- **Leave Management**: Apply for leave requests and track status
- **Salary Information**: View monthly salary calculations and YTD statistics
- **Holiday Calendar**: View company holidays

### For Team Leads
- **Team Dashboard**: Overview of team performance
- **Team Attendance**: View team attendance records
- **Leave Approvals**: Approve or reject team member leave requests
- **Team Analytics**: View team-wide metrics

### For Owners
- **Admin Dashboard**: Full system overview with key metrics
- **Employee Management**: Add, edit, and delete employees
- **Attendance Tracking**: Monitor all employee attendance
- **Leave Management**: Approve/reject leave requests from all employees
- **Salary Management**: View and manage salary records
- **Holiday Management**: Create and manage company holidays

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **UI Components**: Custom components with Tailwind

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5175`

## Environment Setup

No environment variables needed for frontend. API calls are configured to use `http://localhost:5500/api`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── Sidebar.jsx     # Side navigation menu
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Attendance.jsx  # Attendance tracking
│   │   ├── Leave.jsx       # Leave management
│   │   ├── Salary.jsx      # Salary information
│   │   ├── Calendar.jsx    # Holiday calendar
│   │   ├── Employees.jsx   # Employee management (Owner only)
│   │   └── dashboards/     # Role-based dashboards
│   │       ├── OwnerDashboard.jsx
│   │       ├── LeadDashboard.jsx
│   │       └── EmployeeDashboard.jsx
│   ├── services/
│   │   └── api.js          # API configuration and axios instance
│   ├── App.jsx             # Main app component with routes
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles with Tailwind
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in all API requests via the axios interceptor.

Login credentials for testing:
- **Owner**: owner@company.com / password123
- **Team Lead**: lead@company.com / password123
- **Employee**: emp@company.com / password123

## Responsive Design

All pages and components are fully responsive and work seamlessly on:
- Desktop (1920px and above)
- Tablet (768px to 1919px)
- Mobile (Below 768px)

Mobile features include:
- Collapsible sidebar navigation
- Stack-based layout for better usability
- Touch-friendly buttons and inputs

## API Integration

The frontend communicates with the backend API at `http://localhost:5500/api`

Key API endpoints:
- `POST /auth/login` - User authentication
- `GET /employees` - Get all employees
- `POST /attendance/punch-in` - Mark attendance
- `POST /leaves` - Apply for leave
- `GET /salary/me` - Get personal salary info
- `GET /holidays` - Get holidays

## Styling

Tailwind CSS v4 is configured with:
- Custom color schemes
- Responsive breakpoints
- Utility-first CSS approach
- Dark mode support ready

## Contributing

1. Follow the existing code style and structure
2. Use meaningful component and file names
3. Keep components small and reusable
4. Add proper error handling and user feedback
5. Ensure mobile responsiveness

## License

This project is proprietary and confidential.
