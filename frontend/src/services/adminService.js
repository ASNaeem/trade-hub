import api from "./api";

const AdminService = {
  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post("/admin/login", credentials);
      if (response.data.token) {
        // Store admin-specific token and role
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminRole", response.data.role);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
  },

  isAdminLoggedIn: () => {
    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole");
    // Check both token and role exist
    return !!(adminToken && adminRole);
  },

  // Check if user has admin privileges
  hasAdminPrivileges: () => {
    const adminRole = localStorage.getItem("adminRole");
    return adminRole === "admin" || adminRole === "superadmin";
  },

  // User Management
  getUsers: async () => {
    try {
      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data.map((user) => ({
        ...user,
        listings: user.listings || [], // Ensure listings is always an array
        status: user.isBanned
          ? "banned"
          : user.isUnderReview
          ? "suspended"
          : "active",
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/status`,
        {
          status, // Send the status directly as the backend expects
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  },

  deleteUserListing: async (userId, listingId) => {
    try {
      const response = await api.delete(
        `/admin/users/${userId}/listings/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete listing"
      );
    }
  },

  // Document Verification
  getPendingVerifications: async () => {
    try {
      const response = await api.get("/admin/verifications/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch pending verifications"
      );
    }
  },

  verifyDocument: async (userId, isApproved, reason = "") => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/verify-document`,
        {
          isApproved,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to verify document"
      );
    }
  },

  getDocumentFile: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/document`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch document"
      );
    }
  },

  // Dispute Management
  getDisputes: async () => {
    try {
      const response = await api.get("/admin/disputes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch disputes"
      );
    }
  },

  resolveDispute: async (disputeId, resolution) => {
    try {
      const response = await api.put(
        `/admin/disputes/${disputeId}/resolve`,
        { resolution },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to resolve dispute"
      );
    }
  },

  // Policy Management
  getPolicies: async () => {
    try {
      const response = await api.get("/admin/policies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch policies"
      );
    }
  },

  updatePolicy: async (policyId, value) => {
    try {
      const response = await api.put(
        `/admin/policies/${policyId}`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update policy"
      );
    }
  },
};

export default AdminService;
