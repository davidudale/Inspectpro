import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/MainComponent/Homepage";
import Login from "./Components/Page/Login.jsx";
import Register from "./Components/Page/Register.jsx";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./Components/Auth/ProtectedRoute.jsx";
import AdminDashboard from "./Components/Page/AdminDashboard.jsx";
import Supervisor from "./Components/Page/SupervisorDashboard.jsx";
import Unauthorized from "./Components/Page/UnauthorizedPage.jsx";
import InspectionDashboard from "./Components/Page/InspectionDashboard.jsx";
import UserPage from "./Components/Dashboards/AdminFiles/UserManagement/UserPage.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

         {/* Inspector & Above */}
        <Route
          path="/inspectionDashboard"
          element={
            <ProtectedRoute
              allowedRoles={["Inspector", "Supervisor", "Manager", "Admin"]}
            >
              <InspectionDashboard />
            </ProtectedRoute>
          }
        />

        {/* Supervisor & Above */}
        <Route
          path="/SupervisorDashboard"
          element={
            <ProtectedRoute allowedRoles={["Supervisor", "Manager", "Admin"]}>
              <Supervisor />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}
export default App;
