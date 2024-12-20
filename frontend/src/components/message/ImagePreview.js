import React from "react";
import { X } from "lucide-react";

export function ImagePreview({ images, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((image, index) => (
        <div key={index} className="relative inline-block">
          <img
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
            className="h-20 w-auto rounded border border-gray-200"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      ))}
    </div>
  );
}
