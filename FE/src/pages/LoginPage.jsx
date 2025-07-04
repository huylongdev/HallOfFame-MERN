import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ membername: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({
        membername: form.membername,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">⚽</div>
        <div className="absolute top-20 right-20 text-6xl">🏟️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🥅</div>
        <div className="absolute bottom-10 right-10 text-5xl">🏆</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">⚽</div>
        <div className="absolute top-1/3 right-1/3 text-6xl">🏃‍♂️</div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
              <span className="text-4xl">⚽</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">
              Login
            </h2>
            
          </div>

          {/* Form Section */}
          <div className="px-8 py-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border-2 border-red-500/30 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-sm">
                <span className="text-2xl">❌</span>
                <p className="text-red-300 font-semibold">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-1">
                 Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-400 text-xl">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium text-white placeholder-slate-400"
                  value={form.membername}
                  onChange={(e) => setForm({ ...form, membername: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-1">
                 Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-blue-400 text-xl">🔐</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium text-white placeholder-slate-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span></span>
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Section */}
          <div className="bg-slate-700/30 px-8 py-6 text-center border-t border-slate-600/50">
            <p className="text-slate-300 font-medium">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors duration-200"
              >
                Register now! 
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
         
        </div>
      </div>
    </div>
  );
}