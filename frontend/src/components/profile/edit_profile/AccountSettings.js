import React from "react";
import FormSection from "./FormSection";
import { Lock } from "lucide-react";

export default function AccountSettings() {
  return (
    <FormSection title="Account Settings">
      <div className="space-y-4">
        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="text-sm font-medium text-gray-900">
                Change Password
              </h4>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </div>
          <span className="text-sm text-blue-600">Update</span>
        </button>
      </div>
    </FormSection>
  );
}
