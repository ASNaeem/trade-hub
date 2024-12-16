import React from "react";
import { X } from "lucide-react";
import EditProfile from "./EditProfile";

export default function EditProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 animate-[comeup_0.1s_ease-in]">
        <div className="relative w-full max-w-4xl bg-gray-50 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <EditProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
