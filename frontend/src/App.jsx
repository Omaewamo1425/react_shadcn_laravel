import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/user_management/UserList";
import Permission from "./pages/permission/Permission";
import { ToastContainer } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUser, clearAuth } from "./store/authSlice";

export default function App() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // 👇 Fetch user info if token exists
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:8000/api/user_info", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(res.data)); 
        } catch (error) {
          console.error("Failed to fetch user info", error);
          dispatch(clearAuth());
        }
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={token ? <User /> : <Navigate to="/login" />}
        />
        <Route
          path="/permission"
          element={token ? <Permission /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
