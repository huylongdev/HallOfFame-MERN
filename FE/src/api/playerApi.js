import axios from "../config/axios";

// [GET] Lấy danh sách cầu thủ (có hỗ trợ search & filter team)
export const fetchPlayers = (search = "", team = "") => {
  return axios.get("/all", {
    params: { search, team },
  });
};

// [GET] Chi tiết cầu thủ theo ID
export const getPlayerDetail = (id) => {
  return axios.get(`/players/${id}`);
};

// [POST] Gửi comment (feedback) cho 1 cầu thủ
export const postComment = (playerId, data) => {
  return axios.post(`/players/${playerId}/comments`, data);
};

export const updateComment = (playerId, commentId, data) =>
  axios.put(`/players/${playerId}/comments/${commentId}`, data);

export const deleteComment = (playerId, commentId) =>
  axios.delete(`/players/${playerId}/comments/${commentId}`);
