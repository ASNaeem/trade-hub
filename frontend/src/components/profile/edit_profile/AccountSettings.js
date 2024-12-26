import React, { useState } from "react";
import FormSection from "./FormSection";
import { Lock, Trash2, Save } from "lucide-react";
import InputField from "./InputField";
import AlertDialog from "../../AlertDialog";

export default function AccountSettings(loginDataa) {
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      // Handle password mismatch error
      return;
    }
  };

  const handleConfirmPasswordChange = () => {
    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleConfirmDelete = () => {
    // Handle account deletion logic here
    setIsDeleteAccountDialogOpen(false);
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
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </button>

            <div className="space-x-3">
              <button
                type="submit"
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--buttonColor)] hover:bg-[var(--buttonHoverColor)]"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
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
}
