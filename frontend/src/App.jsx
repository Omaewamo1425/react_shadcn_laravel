import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import User from "./pages/user_management/User";
import { useSelector } from "react-redux";

export default function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/users" element={<User />} />
    </Routes>
  );
}
