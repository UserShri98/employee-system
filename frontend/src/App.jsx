import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Salary from "./pages/Salary";
import Calendar from "./pages/Calendar";
import Employees from "./pages/Employees";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerDashboard from "./pages/dashboards/OwnerDashboard";
import LeadDashboard from "./pages/dashboards/LeadDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  if (role === "OWNER") return <OwnerDashboard />;
  if (role === "LEAD") return <LeadDashboard />;
  return <EmployeeDashboard />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route 
          path="/employees" 
          element={<ProtectedRoute><Employees /></ProtectedRoute>} 
        />
        <Route 
          path="/attendance" 
          element={<ProtectedRoute><Attendance /></ProtectedRoute>} 
        />
        <Route 
          path="/leave" 
          element={<ProtectedRoute><Leave /></ProtectedRoute>} 
        />
        <Route 
          path="/salary" 
          element={<ProtectedRoute><Salary /></ProtectedRoute>} 
        />
        <Route 
          path="/calendar" 
          element={<ProtectedRoute><Calendar /></ProtectedRoute>} 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
