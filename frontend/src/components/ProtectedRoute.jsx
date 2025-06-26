import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./Layout";
import { hasPermission } from "@/utils/permissions";

export default function ProtectedRoute({ children, permission }) {
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permissions, permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Layout>{children}</Layout>;
}
