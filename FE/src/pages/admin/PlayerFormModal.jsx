import { useEffect, useState } from "react";

const PlayerFormModal = ({ visible, onClose, onSubmit, teams, initialData, players }) => {
  const [form, setForm] = useState({
    playerName: "",
    cost: "",
    image: "",
    infomation: "",
    team: "",
    isCaptain: false,
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        playerName: "",
        cost: "",
        image: "",
        infomation: "",
        team: "",
        isCaptain: false,
      });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!visible) return null;

  const showCaptainWarning =
    form.isCaptain &&
    form.team &&
    players?.some(
      (p) =>
        p.team._id === form.team &&
        p.isCaptain &&
        (!initialData || p._id !== initialData._id)
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] border border-slate-600/50 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">⚽</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {initialData ? "Edit Player" : "New Player"}
                </h2>
                <p className="text-cyan-100 text-xs">
                  {initialData ? "Update player information" : "Add player to your team"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white hover:text-red-300 transition-all duration-200"
            >
              ✕
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Form Section */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-4">
            {/* Player Name */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>Player Name</span>
              </label>
              <input
                type="text"
                name="playerName"
                placeholder="Enter player name"
                value={form.playerName}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Cost and Image in a row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Cost</span>
                </label>
                <input
                  type="number"
                  name="cost"
                  placeholder="Player cost"
                  value={form.cost}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Image URL</span>
                </label>
                <input
                  type="text"
                  name="image"
                  placeholder="Player image link"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                <span>Team</span>
              </label>
              <select
                name="team"
                value={form.team}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="bg-slate-800">Select a team</option>
                {teams?.map((t) => (
                  <option key={t._id} value={t._id} className="bg-slate-800">
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>

            {/* Information */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Player Information</span>
              </label>
              <textarea
                name="infomation"
                placeholder="Additional player information..."
                value={form.infomation}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
              ></textarea>
            </div>

            {/* Captain Toggle */}
            <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm">👑</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">Team Captain</h3>
                    <p className="text-slate-400 text-xs">Designate as team captain</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isCaptain"
                    checked={form.isCaptain}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-600 shadow-lg"></div>
                </label>
              </div>
            </div>

            {/* Captain Warning */}
            {showCaptainWarning && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <h4 className="text-amber-400 font-medium text-sm">Captain Conflict</h4>
                    <p className="text-amber-300/80 text-sm mt-1">
                      This team already has a captain. Each team should have only one captain.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-600/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {initialData ? "Update Player" : "Add Player"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;