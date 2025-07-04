import { useEffect, useState } from "react";
import {
  getAllPlayers,
  getAllTeams,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../../api/adminApi";
import PlayerFormModal from "../../pages/admin/PlayerFormModal";
import ConfirmModal from "../../components/ConfirmModal";

const PlayersAdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showModal) setSubmissionError("");
  }, [showModal]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res1 = await getAllPlayers();
      const res2 = await getAllTeams();
      setPlayers(res1.data.players);
      setTeams(res2.data.teams || []);
    } catch (err) {
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEdit(false);
    setFormData(null);
    setShowModal(true);
    setSubmissionError("");
  };

  const handleEdit = (player) => {
    setIsEdit(true);
    setEditId(player._id);
    setFormData({
      playerName: player.playerName,
      cost: player.cost,
      image: player.image,
      infomation: player.infomation,
      team: player.team._id,
      isCaptain: player.isCaptain,
    });
    setShowModal(true);
    setSubmissionError("");
  };

  const handleSubmit = async (data) => {
    try {
      setSubmissionError("");
      if (isEdit) {
        await updatePlayer(editId, data);
        setSuccessMessage("✅ Player updated successfully!");
      } else {
        await createPlayer(data);
        setSuccessMessage("✅ Player added successfully!");
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setSubmissionError(err.response?.data?.message || "Error saving player");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmissionError("");
      await deletePlayer(deleteId);
      setSuccessMessage("✅ Player deleted successfully!");
      await loadData();
    } catch (err) {
      setSubmissionError(
        err.response?.data?.message || "Error deleting player."
      );
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[rgb(146,246,219)] via-white to-[rgb(181,224,245)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-[url('/pattern.svg')] bg-repeat"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-teal-700">
            ⚙️ Admin Dashboard: Players
          </h1>
          <button
            onClick={handleCreate}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl shadow-lg transition"
          >
            ➕ Add Player
          </button>
        </header>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 shadow">
            ❌ {error}
          </div>
        )}

        {submissionError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 border border-red-300">
            🚨 {submissionError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4 border border-green-300">
            ✅ {successMessage}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player._id}
              className="bg-white/60 backdrop-blur-lg border border-teal-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={player.image || "/placeholder.png"}
                  alt={player.playerName}
                  className="w-16 h-16 object-cover rounded-full border border-gray-300"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {player.playerName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    #{player._id.slice(-6)}
                  </p>
                </div>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                <li>🏟️ Team: {player.team?.teamName || <i>Free Agent</i>}</li>
                <li>💰 Value: {player.cost?.toLocaleString("vi-VN")} $</li>
                <li>👑 Role: {player.isCaptain ? "Captain" : "Member"}</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(player)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-md text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => confirmDelete(player._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-md text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      <PlayerFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        teams={teams}
        initialData={formData}
        players={players}
      />

      <ConfirmModal
        visible={showConfirm}
        title="Delete Player"
        message="Are you sure you want to delete this player?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default PlayersAdminPage;
