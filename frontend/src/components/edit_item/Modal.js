import React from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-65 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl animate-[comeup_0.1s_ease-in]">
          <div className="flex items-center rounded-t-lg justify-between px-6 py-4 bg-[var(--buttonHoverColor)]">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto ">{children}</div>
        </div>
      </div>
    </div>
  );
}
