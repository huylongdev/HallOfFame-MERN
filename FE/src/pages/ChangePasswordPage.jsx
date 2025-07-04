import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/memberApi";
import { useAuth } from "../contexts/AuthContext";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ Password confirmation does not match.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ New password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }, token);
      setMessage("✅ Password changed successfully. Logging out...");

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error changing password."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">⚽</div>
        <div className="absolute top-20 right-20 text-6xl">🏟️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🥅</div>
        <div className="absolute bottom-10 right-10 text-5xl">🏆</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">⚽</div>
        <div className="absolute top-1/3 right-1/3 text-6xl">🏃‍♂️</div>
        <div className="absolute top-2/3 left-1/2 text-5xl">🔒</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl">🛡️</div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-white hover:text-blue-200 font-medium transition-colors duration-200"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Change Password
            </h2>
            <p className="text-blue-100 font-medium text-sm">
              Secure your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Message Display */}
            {message && (
              <div className={`border-2 rounded-lg p-3 flex items-center space-x-2 ${
                message.includes("✅") 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <span className="text-xl">
                  {message.includes("✅") ? "✅" : "❌"}
                </span>
                <p className={`font-medium ${
                  message.includes("✅") ? "text-green-700" : "text-red-700"
                }`}>
                  {message.replace(/^(✅|❌)\s*/, "")}
                </p>
              </div>
            )}

            {/* Old Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 ml-1">
               Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-lg"></span>
                </div>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-lg"></span>
                </div>
                <input
                  type="password"
                  placeholder="Create new password"
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                 Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-600 text-lg"></span>
                </div>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-700 bg-gray-50 focus:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 rounded-md font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center space-x-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span></span>
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="text-center">
           
              
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;