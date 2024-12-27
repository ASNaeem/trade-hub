import React, { useState, forwardRef, useImperativeHandle } from "react";
import FormSection from "./FormSection";
import { Lock, Trash2 } from "lucide-react";
import InputField from "./InputField";
import AlertDialog from "../../AlertDialog";
import axios from "axios";

const AccountSettings = forwardRef((props, ref) => {
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useImperativeHandle(ref, () => ({
    saveChanges: async () => {
      // Only attempt to save if any password field has a value
      if (
        formData.currentPassword ||
        formData.newPassword ||
        formData.confirmPassword
      ) {
        await handleSaveChanges();
      }
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setError("");
  };

  const handleSaveChanges = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      throw new Error("New passwords don't match");
    }

    if (!formData.currentPassword) {
      throw new Error("Current password is required");
    }

    if (formData.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      handleConfirmPasswordChange();
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleConfirmPasswordChange = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear local storage and redirect to home
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loggedin");
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setIsDeleteAccountDialogOpen(false);
    }
  };

  return (
    <>
      <FormSection title="Account Settings">
        <div className="flex flex-col space-y-4 gap-2">
          <div className="w-full flex flex-row gap-2">
            <Lock className="h-5 w-5 text-[var(--iconColor)]" />
            <div className="text-left text-sm font-medium text-gray-900">
              Change Password
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <InputField
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <InputField
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Retype New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="flex justify-start pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </FormSection>

      {/* Delete Account Dialog */}
      <AlertDialog
        isOpen={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        type="danger"
      />
    </>
  );
});

export default AccountSettings;
