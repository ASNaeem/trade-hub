import React, { useState } from "react";
import FormSection from "./FormSection";
import { Lock, Trash2, Save } from "lucide-react";
import InputField from "./InputField";

export default function AccountSettings(loginDataa) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <FormSection title="Account Settings">
      <div className="flex flex-col space-y-4 gap-2">
        <div className="w-full flex flex-row gap-2">
          <Lock className="h-5 w-5 text-[var(--iconColor)]" />
          <div className="text-left text-sm font-medium text-gray-900">
            Change Password
          </div>
        </div>
        <InputField
          placeholder="Current Password"
          value={loginDataa.password}
          onChange={handleChange}
        />
        <InputField
          placeholder="New Password"
          value={loginDataa.password}
          onChange={handleChange}
        />
        <InputField
          placeholder="Retype New Password"
          value={loginDataa.password}
          onChange={handleChange}
        />
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </button>

          <div className="space-x-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--buttonColor)]  hover:bg-[var(--buttonHoverColor)]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
