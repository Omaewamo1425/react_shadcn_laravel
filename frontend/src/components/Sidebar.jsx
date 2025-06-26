import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "@/utils/permissions";
import { Home, Users, ShieldCheck, Settings, X } from "lucide-react";

export default function Sidebar({ isOpen = true, onClose }) {
  const permissions = useSelector((state) => state.auth.permissions);
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/users", label: "Users", icon: Users, permission: "view-users" },
    { to: "/permission", label: "Permission", icon: ShieldCheck },
    { to: "/role", label: "Role", icon: Settings },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 transform transition-transform duration-300 z-40
        border-r shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <div className="md:hidden flex justify-end p-2">
        <button onClick={onClose} className="text-gray-700 dark:text-gray-200">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-semibold">Navigation</h2>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon, permission }) => {
            if (permission && !hasPermission(permissions, permission)) return null;
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition-colors font-medium text-sm ${
                  isActive
                    ? "bg-muted text-primary dark:bg-gray-700 dark:text-white"
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}