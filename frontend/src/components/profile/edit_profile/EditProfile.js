import React, { useState, useRef } from "react";
import { Save } from "lucide-react";
import ProfileForm from "./ProfileForm";
import AccountSettings from "./AccountSettings";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const profileFormRef = useRef();
  const accountSettingsRef = useRef();

  const handleSaveAll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Try to save both forms regardless of changes
      await Promise.all([
        profileFormRef.current?.saveChanges(),
        accountSettingsRef.current?.saveChanges(),
      ]);

      setSuccess("All changes saved successfully");
    } catch (err) {
      setError(err.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          {success}
        </div>
      )}

      <ProfileForm ref={profileFormRef} />
      <AccountSettings ref={accountSettingsRef} />

      <div className="flex justify-end pt-4 border-t">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
            ${
              loading
                ? "bg-gray-400"
                : "bg-[var(--buttonColor)] hover:bg-[var(--buttonHoverColor)]"
            }
            ${loading ? "cursor-wait" : "cursor-pointer"}`}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
