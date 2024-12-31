import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AdminService from "../../services/adminService";

const AdminRoute = ({ children, requireSuperAdmin = false }) => {
  const navigate = useNavigate();
  const isLoggedIn = AdminService.isAdminLoggedIn();
  const adminRole = AdminService.getAdminRole();

  useEffect(() => {
    // Check token validity
    if (isLoggedIn) {
      const token = AdminService.getAdminToken();
      if (!token) {
        AdminService.logout();
        navigate("/admin/login");
      }
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireSuperAdmin && adminRole !== "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
