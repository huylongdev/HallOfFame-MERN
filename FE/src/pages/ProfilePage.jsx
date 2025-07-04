import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../api/memberApi";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: "", YOB: "", membername: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile(token);
        setProfile(res.data);
      } catch {
        setError("❌ Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccess("");
    setError("");

    const currentYear = new Date().getFullYear();
    const yob = parseInt(profile.YOB);

    if (isNaN(yob) || yob > currentYear) {
      setError("⚠️ Invalid year of birth.");
      setIsUpdating(false);
      return;
    }

    try {
      await updateProfile({ name: profile.name, YOB: yob }, token);
      setSuccess("✅ Profile updated.");
    } catch {
      setError("❌ Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[#fefefe] text-black rounded-lg shadow-2xl border-4 border-black grid md:grid-cols-2 gap-8 p-8">
        {/* Left section - profile info */}
        <div className="flex flex-col items-center justify-center border-r-4 border-black pr-4">
          <div className="bg-orange-400 w-32 h-32 rounded-lg flex items-center justify-center text-6xl shadow-inner border-4 border-black">
            👤
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-wide">
            {profile.membername}
          </h2>
          <p className="text-gray-600 mt-1">Username (fixed)</p>
        </div>

        {/* Right section - form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center space-y-4"
        >
          {success && (
            <div className="bg-green-100 border-l-4 border-green-600 p-3 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 p-3 text-sm">
              {error}
            </div>
          )}

          <label className="text-sm font-bold">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="border-4 border-black rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <label className="text-sm font-bold">Year of Birth</label>
          <input
            type="number"
            name="YOB"
            value={profile.YOB}
            onChange={handleChange}
            min="1950"
            className="border-4 border-black rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-black text-white px-4 py-2 rounded-md font-bold border-2 border-orange-500 hover:bg-orange-500 transition-all duration-200"
          >
            {isUpdating ? "Saving..." : "💾 Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/change-password")}
            className="text-sm mt-2 underline text-blue-700 hover:text-blue-900"
          >
            🔑 Change Password →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
