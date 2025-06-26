import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Sun, Moon, Bell, User, LogOut } from "lucide-react";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { clearAuth } from "../store/authSlice";

export default function Navbar({ onToggleSidebar, applyTheme, isDark }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [notificationCount] = useState(2);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(clearAuth());
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between h-[64px]">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          ☰
        </Button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
          {location.pathname.replace("/", "") || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Sun className={`h-5 w-5 ${isDark ? "hidden" : "block"}`} />
              <Moon className={`h-5 w-5 absolute ${isDark ? "block" : "hidden"}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => applyTheme("light")}>🌞 Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTheme("dark")}>🌙 Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTheme("system")}>🖥 System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e15b05] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              🔔 You have {notificationCount} new messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="ring-2 ring-[#e15b05]">
                <AvatarImage src="https://avatars.githubusercontent.com/u/1486366" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-white">
                {user?.name || "User"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
