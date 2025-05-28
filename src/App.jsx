import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";

import AdminLogin from "./pages/AdminLogin.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import AdminDashboard from "./pages/AdminPage.jsx";
import AddUser from "./pages/AddUser.jsx";
import "./index.css";

function App() {
  const isAuthenticated = false; // update this based on your cookie/token logic
  return (
    <CookiesProvider>
      <Toaster />
      <Router>
        <Routes>
          <Route
            path="/admin/login"
            element={
              <AdminLogin />
            }
          />
          <Route
            path="/admin/home"
            element={
              !isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
            }
          />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/add" element={<AddUser />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
