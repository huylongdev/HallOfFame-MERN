import { useEffect, useState } from "react";
import { fetchPlayers } from "../api/playerApi";
import { Link, useLocation } from "react-router-dom";

export default function HomePage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingTeam, setPendingTeam] = useState("");

  const location = useLocation();

  const loadPlayers = async () => {
    try {
      const res = await fetchPlayers(search, selectedTeam);
      setPlayers(res.data.players);
      setTeams(res.data.teams);
    } catch (err) {
      console.error("Error loading players:", err.message);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [search, selectedTeam]);

  useEffect(() => {
    if (location.pathname === "/") {
      setSearch("");
      setSelectedTeam("");
      setPendingSearch("");
      setPendingTeam("");
    }
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right,rgb(146, 246, 219), #ffffff,rgb(181, 224, 245))",
        zIndex: 0,
        position: "relative",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-teal-700 cursor-pointer"
            onClick={() => {
              setPendingSearch("");
              setPendingTeam("");
              setSearch("");
              setSelectedTeam("");
            }}
          >
            🌟 Football Hall Of Fame
          </h1>
          <p className="mt-2 text-gray-500">
            Discover legendary players and their iconic clubs
          </p>
          <div className="w-20 h-1 bg-emerald-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Search Box */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-teal-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-12 pr-12 py-3 rounded-full bg-teal-50 text-gray-700 placeholder-teal-400 border border-teal-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all"
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearch(pendingSearch);
                    setSelectedTeam(pendingTeam);
                  }
                }}
              />
              {pendingSearch && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
                  onClick={() => {
                    setPendingSearch("");
                    setPendingTeam("");
                    setSearch("");
                    setSelectedTeam("");
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="w-full md:w-1/3 relative">
              <select
                className="w-full py-3 px-5 rounded-full bg-white text-gray-700 border border-teal-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-all"
                value={pendingTeam}
                onChange={(e) => {
                  const newTeam = e.target.value;
                  setPendingTeam(newTeam);
                  setSelectedTeam(newTeam); // Trigger filter immediately
                  setSearch(pendingSearch); // Keep current search
                }}
              >
                <option value="">🏳 All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info Counter */}
        <div className="text-center text-gray-600 mb-6 font-medium">
          {players.length > 0 ? (
            <p>
              🔍 Found <strong>{players.length}</strong> players matching your
              search.
            </p>
          ) : (
            <p>🙁 No matching players found.</p>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {players.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              {/* Player Image */}
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.playerName}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Captain Badge */}
                {p.isCaptain && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full shadow">
                    👑 Captain
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="bg-gradient-to-t from-white to-teal-50 px-5 py-4">
                <h3 className="text-lg font-bold text-teal-800 group-hover:text-cyan-600 transition">
                  {p.playerName}
                </h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  🏟 <span>{p.team?.teamName || "Free agent"}</span>
                </p>

                <Link
                  to={`/players/${p._id}`}
                  className="mt-4 inline-block bg-teal-100 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow hover:shadow-md"
                >
                  📋 View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
