import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    membername: "",
    password: "",
    name: "",
    YOB: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Custom password length validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">⚽</div>
        <div className="absolute top-20 right-20 text-6xl">🏟️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🥅</div>
        <div className="absolute bottom-10 right-10 text-5xl">🏆</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">⚽</div>
        <div className="absolute top-1/3 right-1/3 text-6xl">🏃‍♂️</div>
        <div className="absolute top-2/3 left-1/2 text-5xl">🏅</div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Sign Up</h2>
           
          </div>

          <div className="px-8 py-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <span className="text-2xl">❌</span>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-xl">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={form.membername}
                  onChange={(e) => setForm({ ...form, membername: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-xl">📝</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 Year of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-xl">📅</span>
                </div>
                <input
                  type="number"
                  placeholder="E.g., 1995"
                  min="1950"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={form.YOB}
                  onChange={(e) => setForm({ ...form, YOB: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-xl">🔐</span>
                </div>
                <input
                  type="password"
                  placeholder="Create a strong password (≥ 6 characters)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>🎯</span>
                  <span>Sign Up Now</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors duration-200"
              >
                Log in now! 🚀
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white text-sm opacity-90 font-medium">
            🌟 Free to join - Start your football journey!
          </p>
        </div>
      </div>
    </div>
  );
}