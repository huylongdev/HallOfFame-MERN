import axios from "../config/axios";

export const getAllPlayers = () => {
  return axios.get("/admin/players");
};
export const createPlayer = (data) => axios.post("/admin/players", data);
export const updatePlayer = (id, data) =>
  axios.put(`/admin/players/${id}`, data);
export const deletePlayer = (id) => axios.delete(`/admin/players/${id}`);

// CRUD cho đội bóng
export const getAllTeams = () => axios.get("/admin/teams");
export const createTeam = (data) => axios.post("/admin/teams/create", data);
export const updateTeam = (id, data) =>
  axios.put(`/admin/teams/update/${id}`, data);
export const deleteTeam = (id) => axios.delete(`/admin/teams/${id}`);

// Get Accounts
export const getAllAccounts = () => axios.get("/admin/accounts");
