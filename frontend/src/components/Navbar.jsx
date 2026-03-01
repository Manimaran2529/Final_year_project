import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name");
  const userEmail = localStorage.getItem("user_email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 w-full bg-black/70 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Left Side */}
        <h1 className="text-lg font-semibold text-white tracking-tight">
          JobTrust AI
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {userName && (
            <div className="text-right">
              <p className="text-sm text-white font-medium">
                {userName}
              </p>
              <p className="text-xs text-gray-400">
                {userEmail}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}