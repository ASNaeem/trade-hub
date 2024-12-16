import React from "react";
import { X, Upload } from "lucide-react";

export default function ImageGallery({ images, onRemoveImage, onAddImage }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Item Images
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Product ${index + 1}`}
              className="h-40 w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddImage}
          className="h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
