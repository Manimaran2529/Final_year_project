import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  BarChart3,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />
    },
    {
      name: "Analyze Job",
      path: "/analyze-job",
      icon: <ShieldCheck size={18} />
    },
    {
      name: "Interview Prep",
      path: "/interview-prep",
      icon: <BookOpen size={18} />
    },
    {
      name: "Reply for HR",
      path: "/hr-reply",
      icon: <Mail size={18} />
    },
    {
      name: "Progress",
      path: "/progress",
      icon: <BarChart3 size={18} />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 backdrop-blur-xl bg-white/5 border-r border-white/10 p-6 flex flex-col`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-10">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            JobTrust AI
          </h1>
        )}

        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="space-y-4 flex-1">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === "/dashboard"} 
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 shadow-lg"
                  : "hover:bg-white/10 text-gray-300"
              }`
            }
          >
            {link.icon}
            {!collapsed && link.name}
          </NavLink>
        ))}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-3 rounded-xl transition"
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}