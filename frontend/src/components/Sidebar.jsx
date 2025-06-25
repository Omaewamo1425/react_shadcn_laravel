import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "@/utils/permissions";
export default function Sidebar() {
  const permissions = useSelector((state) => state.auth.permissions);
  return (
    <div className="w-64 h-screen bg-white border-r p-4 space-y-4 shadow">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block py-2 px-4 rounded hover:bg-gray-100"
        >
          Dashboard
        </Link>
        {hasPermission(permissions, 'view-users') && (
          <Link
            to="/users"
            className="block py-2 px-4 rounded hover:bg-gray-100"
          >
            Users
          </Link>
        )}
        <Link
          to="/permission"
          className="block py-2 px-4 rounded hover:bg-gray-100"
        >
          Permission
        </Link>
        <Link
          to="/role"
          className="block py-2 px-4 rounded hover:bg-gray-100"
        >
          Role
        </Link>
        {/* Add more menu items here if needed */}
      </nav>
    </div>
  );
}
