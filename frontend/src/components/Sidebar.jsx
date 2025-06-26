import { Link, useLocation } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function Sidebar({ sidebarOpen, sidebarCollapsed, visibleLinks, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${sidebarCollapsed ? "w-20" : "w-56"}`}
      >
        <div className="h-[64px] px-4 flex items-center">
          {sidebarCollapsed ? (
            <Rocket className="text-[#e15b05] h-6 w-6 mx-auto" />
          ) : (
            <h2 className="text-lg font-extrabold text-[#e15b05] tracking-wide">🚀 MyApp</h2>
          )}
        </div>
        <nav className="flex flex-col gap-1 p-2 border-t border-gray-200 dark:border-gray-700">
          {visibleLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => toggleSidebar(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#e15b05]/10 text-[#e15b05] font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-[#e15b05]" : ""}`} />
                {!sidebarCollapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}
    </>
  );
}
