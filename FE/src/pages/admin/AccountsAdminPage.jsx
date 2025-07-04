import { useEffect, useState } from "react";
import { getAllAccounts } from "../../api/adminApi";

const AccountsAdminPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllAccounts();
        if (res.data && Array.isArray(res.data.data)) {
          setData(res.data.data);
        } else {
          setData([]);
        }
      } catch (err) {
        setError("Unable to load account list.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0e1c] to-black px-6 py-10 relative overflow-hidden">
      {/* Animated blurred background effects */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 blur-[130px] animate-pulse -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            👥 Admin Dashboard: Users
          </h1>
          <p className="text-slate-400 mt-2">
            Visual overview of all registered accounts
          </p>
          <div className="mt-4">
            <span className="inline-block text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full font-mono">
              {data.length} user{data.length !== 1 && "s"} loaded
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-800/20 text-red-300 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center text-white py-24 text-xl font-semibold animate-pulse">
            Loading users...
          </div>
        )}

        {/* Users Grid */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.map((user, index) => {
              const age =
                user.YOB && !isNaN(user.YOB)
                  ? new Date().getFullYear() - user.YOB
                  : null;
              return (
                <div
                  key={user._id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl hover:scale-[1.02] hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md">
                    {user.membername?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {/* Name & ID */}
                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-lg">
                      {user.membername || "Unknown"}
                    </h3>
                    <p className="text-slate-400 text-xs font-mono">
                      ID: {user._id?.slice(-6)}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-300">
                      <strong className="text-cyan-400">Full name: </strong>
                      {user.name || (
                        <span className="italic text-slate-500">
                          Not provided
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-purple-400">
                        Year of Birth:{" "}
                      </strong>
                      {user.YOB || (
                        <span className="italic text-slate-500">Unknown</span>
                      )}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-pink-400">Age: </strong>
                      {age ? (
                        <span className="bg-pink-400/10 text-pink-300 px-2 py-0.5 rounded-full">
                          {age} years
                        </span>
                      ) : (
                        <span className="italic text-slate-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No data */}
        {!loading && data.length === 0 && (
          <div className="text-center text-slate-400 py-24 text-lg">
            No user accounts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsAdminPage;
