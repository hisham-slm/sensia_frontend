import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { Toaster } from "react-hot-toast";

import AdminLogin from "./pages/AdminLogin.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import AdminDashboard from "./pages/AdminPage.jsx";
import AddUser from "./pages/AddUser.jsx";
import "./index.css";

function AppRoutes() {
  const [cookies] = useCookies(['access_token']);
  const isAuthenticated = !!cookies.access_token;

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/home"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
        }
      />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/add" element={<AddUser />} />
    </Routes>
  );
}

function App() {
  return (
    <CookiesProvider>
      <Toaster />
      <Router>
        <AppRoutes />
      </Router>
    </CookiesProvider>
  );
}

export default App;
