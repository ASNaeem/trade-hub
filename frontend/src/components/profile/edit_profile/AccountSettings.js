import React, { useState } from "react";
import FormSection from "./FormSection";
import { Lock } from "lucide-react";
import InputField from "./InputField";

export default function AccountSettings(loginDataa) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <FormSection title="Account Settings">
      <div className="flex flex-col space-y-4 gap-2">
        <div className="w-full flex flex-row">
          <Lock className="h-5 w-5 text-[#1d4e6e] mr-3" />
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
        <div className="flex justify-end">
          <button className="bg-[#1d4e6e] text-white px-4 py-2 rounded-md hover:bg-[#1f4057]">
            Save Changes
          </button>
        </div>
      </div>
    </FormSection>
  );
}
