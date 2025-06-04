import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}users/`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}jwt/create/`, credentials);
};
