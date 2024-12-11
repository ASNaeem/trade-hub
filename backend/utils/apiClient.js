// src/utils/apiClient.js
const axios = require("axios");

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:5000/api",
  timeout: 5000,
});

module.exports = apiClient;
