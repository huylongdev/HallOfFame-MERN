import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { token, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-teal-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Giữ nguyên logo & trophy */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition duration-300">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-yellow-400 drop-shadow-md group-hover:text-yellow-300 transition duration-300">
              🏆 HallOfFame 🏆
            </span>
            <span className="text-xs text-gray-300 tracking-wide">
              Legendary Football Stars
            </span>
          </div>
        </Link>
        {/* Menu mới đơn giản hóa */}
        {!isAuthPage && (
          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-teal-600 border border-teal-300 rounded-full hover:bg-teal-50 transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full hover:from-teal-500 hover:to-cyan-600 transition font-semibold shadow"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/players"
                      className="text-sm text-gray-700 hover:text-teal-600 font-medium"
                    >
                      Players
                    </Link>
                    <Link
                      to="/admin/teams"
                      className="text-sm text-gray-700 hover:text-teal-600 font-medium"
                    >
                      Teams
                    </Link>
                    <Link
                      to="/admin/accounts"
                      className="text-sm text-gray-700 hover:text-teal-600 font-medium"
                    >
                      Accounts
                    </Link>
                  </>
                )}

                {!isAdmin && (
                  <Link
                    to="/profile"
                    className="text-sm text-gray-700 hover:text-teal-600 font-medium"
                  >
                    Profile
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-500 border border-red-300 rounded-full hover:bg-red-50 transition font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
