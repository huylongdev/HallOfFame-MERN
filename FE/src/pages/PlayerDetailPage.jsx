import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getPlayerDetail,
  postComment,
  updateComment,
  deleteComment,
} from "../api/playerApi";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const PlayerDetailPage = () => {
  const { id } = useParams();
  const { token, isAdmin, user } = useAuth();

  const [player, setPlayer] = useState(null);
  const [userCanComment, setUserCanComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const [memberComment, setMemberComment] = useState(null);
  const [otherComments, setOtherComments] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(1);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      // Explicitly use 'en-US' for English locale and Ho Chi Minh City timezone
      return new Date(dateString).toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        ...options,
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  const processComments = useCallback((playerData, userData) => {
    if (!playerData || !playerData.comments) {
      setMemberComment(null);
      setOtherComments([]);
      return;
    }

    const memberId = userData?._id?.toString() || userData?.id?.toString();
    let found = null;
    const rest = [];

    for (const c of playerData.comments) {
      const authorId = c.author?._id?.toString() || c.author?.toString();
      if (userData && authorId === memberId) {
        found = c;
      } else {
        rest.push(c);
      }
    }

    setMemberComment(found);
    setOtherComments(rest);
  }, []);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res = await getPlayerDetail(id, token);
        setPlayer(res.data.player);
        setUserCanComment(res.data.userCanComment);
        setError("");
      } catch (err) {
        console.error("Error fetching player detail:", err);
        setError("Unable to load player data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id, token]);

  useEffect(() => {
    if (player && user !== undefined) {
      processComments(player, user);
      setCurrentPage(1);
    } else if (player && user === null) {
      processComments(player, null);
      setCurrentPage(1);
    }
  }, [player, user, processComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await postComment(id, { rating, content }, token);
      setSubmitMessage("✅ Comment submitted successfully!");
      setPlayer(res.data.player);
      setUserCanComment(false);
      setContent("");
      setRating(1);
      setHoverRating(0);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setSubmitMessage(
        err.response?.data?.message || "❌ Error submitting comment"
      );
    }
  };

  const handleEditStart = () => {
    setEditMode(true);
    setEditContent(memberComment.content);
    setEditRating(memberComment.rating);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditContent("");
    setEditRating(1);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateComment(
        id,
        memberComment._id,
        {
          content: editContent,
          rating: editRating,
        },
        token
      );
      setPlayer(res.data.player);
      setEditMode(false);
      setSubmitMessage("✅ Comment updated successfully");
    } catch (err) {
      console.error("Error updating comment:", err);
      setSubmitMessage(
        err.response?.data?.message || "❌ Error updating comment"
      );
    }
  };

  const handleDeleteCommentClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      const res = await deleteComment(id, memberComment._id);
      setPlayer(res.data.player);
      setMemberComment(null);
      setUserCanComment(true);
      setSubmitMessage("✅ Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      setSubmitMessage(
        err.response?.data?.message || "❌ Error deleting comment"
      );
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const renderStars = (value, onClick, onHover) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      return (
        <span
          key={starIndex}
          onClick={() => onClick?.(starIndex)}
          onMouseEnter={() => onHover?.(starIndex)}
          onMouseLeave={() => onHover?.(0)}
          className={`text-2xl cursor-pointer transition ${
            starIndex <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    });
  };

  if (loading)
    return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!player) return null;

  const availableCommentSlots = commentsPerPage - (memberComment ? 1 : 0);
  const displaySlots =
    availableCommentSlots > 0 ? availableCommentSlots : commentsPerPage;
  const pagedComments = otherComments.slice(
    (currentPage - 1) * displaySlots,
    currentPage * displaySlots
  );
  const totalPages = Math.max(
    1,
    Math.ceil(otherComments.length / displaySlots)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-slate-900 to-black text-white">
      {/* Background Icons */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">⚽</div>
        <div className="absolute top-20 right-20 text-6xl">🏃‍♂️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🥅</div>
        <div className="absolute bottom-10 right-10 text-5xl">🏅</div>
        <div className="absolute top-1/3 right-1/4 text-6xl">⭐</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 mb-8 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 flex justify-between items-center">
                  <span>{player.playerName}</span>
                  {player.isCaptain && (
                    <span className="text-sm text-yellow-300">🏅 Captain</span>
                  )}
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  {player.team.teamName}
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="p-5 bg-gray-50 border-b border-gray-100">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-gray-300 shadow bg-gray-200">
              <img
                src={player.image}
                alt={player.playerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-5 bg-white border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>📋</span>
              <span>Player Details</span>
            </h4>
            <p className="text-gray-700 leading-relaxed text-justify">
              {player.infomation}
            </p>
          </div>

          {/* Comments Section */}
          <div className="px-6 py-5 bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              🗨️ Comments
            </h3>

            {player.comments.length === 0 ? (
              <p className="text-gray-500 italic mt-2">
                No comments for this player yet.
              </p>
            ) : (
              <>
                <ul className="mt-3 space-y-3">
                  {/* Your Comment */}
                  {memberComment && (
                    <li className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow">
                      {editMode ? (
                        <form onSubmit={handleEditSubmit} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-blue-700">
                              👤 You
                            </span>
                            <div className="flex space-x-1">
                              {renderStars(editRating, setEditRating)}
                            </div>
                          </div>
                          <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="3"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              className="bg-gray-300 text-gray-800 px-3 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-blue-700">
                              👤 You
                            </span>
                            <span className="text-yellow-500 text-xl">
                              {Array.from(
                                { length: memberComment.rating },
                                (_, i) => (
                                  <span key={i}>★</span>
                                )
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {memberComment.content}
                          </p>
                          <div className="text-right text-gray-500 text-xs mt-1">
                            {formatDate(
                              memberComment.updatedAt || memberComment.createdAt
                            )}
                          </div>
                          <div className="flex justify-end mt-2 gap-2">
                            <button
                              onClick={handleEditStart}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={handleDeleteCommentClick}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  )}

                  {/* Other Comments */}
                  {pagedComments.map((c) => (
                    <li
                      key={c._id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-blue-700">
                          {c.author?.membername || "Anonymous"}
                        </span>
                        <span className="text-yellow-500 text-xl">
                          {Array.from({ length: c.rating }, (_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </span>
                      </div>
                      <p className="text-gray-700">{c.content}</p>
                      <div className="text-right text-gray-500 text-xs mt-1">
                        {formatDate(c.updatedAt || c.createdAt)}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 gap-3">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* New Comment Submission */}
            {!isAdmin && (
              <div className="mt-6">
                {submitMessage && (
                  <div
                    className={`text-sm font-medium mb-3 ${
                      submitMessage.startsWith("✅")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}
                {token ? (
                  userCanComment ? (
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {renderStars(rating, setRating, setHoverRating)}
                        </div>
                      </div>
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Comment content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                      >
                        Submit Comment
                      </button>
                    </form>
                  ) : (
                    <p className="text-gray-600 italic mt-3">
                      You have already submitted a comment for this player.
                    </p>
                  )
                ) : (
                  <p className="text-blue-600 italic mt-3">
                    <a href="/login" className="underline font-medium">
                      Log in
                    </a>{" "}
                    to submit a comment.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600 text-center">
            <span>⚽ Player Details</span>
          </div>
        </div>

        <div className="text-center text-gray-200 text-sm opacity-90 mt-4">
          ✨ View player information and comments
        </div>
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Confirm Comment Deletion"
        message="Are you sure you want to delete this comment?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default PlayerDetailPage;
