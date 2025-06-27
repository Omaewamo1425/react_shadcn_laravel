import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { hasPermission } from "@/utils/permissions";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Home, Users, ShieldCheck, Settings } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/users", label: "Users", icon: Users, permission: "view-users" },
  { to: "/permission", label: "Permission", icon: ShieldCheck, permission: "view-roles" },
  { to: "/role", label: "Role", icon: Settings, permission: "view-roles" },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { permissions, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    applyTheme(storedTheme);
    const closeOnEsc = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  const applyTheme = (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.add(isDarkMode ? "dark" : "light");
    setIsDark(isDarkMode);
  };

  const visibleLinks = navLinks.filter(
    ({ permission }) => !permission || hasPermission(permissions, permission)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {!loading && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          visibleLinks={visibleLinks}
          toggleSidebar={(open) => setSidebarOpen(open)}
        />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onToggleSidebar={() =>
            window.innerWidth < 768
              ? setSidebarOpen(!sidebarOpen)
              : setSidebarCollapsed(!sidebarCollapsed)
          }
          applyTheme={applyTheme}
          isDark={isDark}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-gray-900/80 shadow-xl p-4 md:p-6 min-h-[calc(100vh-64px-48px)] transition-all"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
