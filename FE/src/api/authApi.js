import axios from "../config/axios";

export const registerUser = (data) => axios.post("/register", data);
export const loginUser = (data) => axios.post("/login", data);
