import axios from '../config/axios';

// Lấy thông tin hồ sơ người dùng
export const fetchProfile = (token) => {
  return axios.get('/profile');
};

// Cập nhật hồ sơ người dùng
export const updateProfile = (data, token) => {
  return axios.put('/profile/update', data);
};

export const changePassword = (data, token) => {
  return axios.put("/profile/change-password", data);
};