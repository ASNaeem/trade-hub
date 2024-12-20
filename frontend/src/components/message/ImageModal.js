import React from "react";
import { X } from "lucide-react";

export function ImageModal({ imageUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-h-[85vh] object-contain rounded"
        />
      </div>
    </div>
  );
}
