import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth';

const registerCustomer = (userData) => {
  return axios.post(`${API_URL}/register/customer`, userData);
};

const registerAdmin = (userData) => {
  return axios.post(`${API_URL}/register/admin`, userData);
};

const loginAdmin = (credentials) => {
  return axios.post(`${API_URL}/login/admin`, credentials);
};

const verifyEmail = (token) => {
  return axios.get(`${API_URL}/verify-email?token=${token}`);
};


export default {
  registerCustomer,
  registerAdmin,
  loginAdmin,
  verifyEmail,
};