import axios from "axios";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to automatically add admin token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AdminService = {
  // Authentication
  async login(email, password) {
    const response = await axiosInstance.post(`/admin/login`, {
      email,
      password,
    });
    // Store all admin info
    const { token, id, name, email: adminEmail, role } = response.data;
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminId", id);
    localStorage.setItem("adminName", name);
    localStorage.setItem("adminEmail", adminEmail);
    localStorage.setItem("adminRole", role);
    return response.data;
  },

  // Check if user is logged in as admin
  isAdminLoggedIn() {
    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole");
    return !!(adminToken && adminRole);
  },

  // Get admin info
  getAdminInfo() {
    return {
      id: localStorage.getItem("adminId"),
      name: localStorage.getItem("adminName"),
      email: localStorage.getItem("adminEmail"),
      role: localStorage.getItem("adminRole"),
    };
  },

  // Get admin token
  getAdminToken() {
    return localStorage.getItem("adminToken");
  },

  // Get admin role
  getAdminRole() {
    return localStorage.getItem("adminRole");
  },

  // Logout
  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
  },

  // User Management
  async getUsers() {
    const response = await axiosInstance.get(`/admin/users`);
    return response.data;
  },

  async updateUserStatus(userId, status) {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  },

  async deleteUserListing(userId, listingId) {
    const response = await axiosInstance.delete(
      `/admin/users/${userId}/listings/${listingId}`
    );
    return response.data;
  },

  // Dispute Management
  async getDisputes() {
    const response = await axiosInstance.get(`/admin/disputes`);
    return response.data;
  },

  async resolveDispute(disputeId, resolution) {
    const response = await axiosInstance.put(
      `/admin/disputes/${disputeId}/resolve`,
      { resolution }
    );
    return response.data;
  },

  // Policy Management
  async getPolicies() {
    const response = await axiosInstance.get(`/admin/policies`);
    return response.data;
  },

  async updatePolicy(policyId, value) {
    const response = await axiosInstance.put(`/admin/policies/${policyId}`, {
      value,
    });
    return response.data;
  },
};

export default AdminService;
