import { useEffect, useState } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../api/adminApi";
import ConfirmModal from "../../components/ConfirmModal";

const TeamsAdminPage = () => {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await getAllTeams();
      setTeams(res.data.teams || []);
    } catch {
      setError("❌ Unable to load team list.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nameTrimmed = name.trim().toLowerCase();
    const isDuplicate = teams.some(
      (t) => t.teamName.trim().toLowerCase() === nameTrimmed && t._id !== editId
    );

    if (isDuplicate) {
      setError("❌ Team name already exists.");
      return;
    }

    try {
      if (editId) {
        await updateTeam(editId, { teamName: name });
        setSuccess("✅ Team updated.");
      } else {
        await createTeam({ teamName: name });
        setSuccess("✅ Team added.");
      }
      setName("");
      setEditId("");
      setShowForm(false);
      await loadTeams();
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Error saving team."));
    }
  };

  const handleEdit = (team) => {
    setEditId(team._id);
    setName(team.teamName);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTeam(deleteId);
      await loadTeams();
      setSuccess("🗑️ Team deleted.");
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Error deleting team."));
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏆 Manage Teams</h1>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditId("");
            setName("");
            setError("");
            setSuccess("");
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
        >
          {showForm ? "✖ Cancel" : "➕ Add Team"}
        </button>
      </div>

      {/* Notification */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 border border-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 border border-green-300">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="relative z-10 mb-10">
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm rounded-xl transition-all duration-300"></div>

          <form
            onSubmit={handleSubmit}
            className="relative z-20 mx-auto mt-4 w-full max-w-xl bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100 p-8"
          >
            <h2 className="text-2xl font-extrabold text-indigo-700 mb-6 flex items-center gap-2">
              {editId ? "🛠️ Edit Team" : "🚀 Create New Team"}
            </h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                📛 Team Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter team name..."
                className="w-full rounded-xl px-4 py-3 border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-90"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                {editId ? "💾 Save Changes" : "➕ Add Team"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditId("");
                  setName("");
                  setShowForm(false);
                }}
                className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team List */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Team Name</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <tr key={team._id} className="border-t">
                  <td className="px-6 py-4 text-gray-800">{team.teamName}</td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    <button
                      onClick={() => handleEdit(team)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(team._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-6 text-gray-400 italic bg-white"
                >
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-sm text-gray-500">
        Total teams: <strong>{teams.length}</strong>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={showConfirm}
        title="Delete Team"
        message="Are you sure you want to delete this team?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default TeamsAdminPage;
