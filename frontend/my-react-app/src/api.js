// src/api.js
import axios from 'axios';

const flaskApi = axios.create({
  baseURL: 'http://localhost:5001'  // your Flask backend URL
});

// Automatically attach the JWT token to each request
flaskApi.interceptors.request.use(
  (config) => {
    // Get the token from localStorage using the same key as in your login.jsx
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default flaskApi;
