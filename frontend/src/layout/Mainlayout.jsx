import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name");
  const userEmail = localStorage.getItem("user_email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatTitle = (path) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    return parts
      .map((part) =>
        part
          .replace("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(" / ");
  };

  const pageTitle = formatTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <div className="flex items-center justify-between px-12 py-6 border-b border-white/10 backdrop-blur-xl bg-white/5">

          <h2 className="text-2xl font-semibold">
            {pageTitle}
          </h2>

          <div className="flex items-center gap-6">

            {/* Search */}
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl gap-2">
              <Search size={16} />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm"
              />
            </div>

            {/* Notification */}
            <Bell size={18} className="cursor-pointer hover:text-blue-400" />

            {/* Welcome + Avatar */}
            <div className="flex items-center gap-3">

              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-400">Welcome</p>
                <p className="text-sm font-semibold text-white">
                  {userName || userEmail}
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                {(userName || userEmail)?.charAt(0).toUpperCase()}
              </div>

            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>
        </div>

        {/* Page Content */}
        <motion.div
          className="flex-1 p-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>

      </div>
    </div>
  );
}