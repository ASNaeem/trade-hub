import React from "react";
import { Upload, X } from "lucide-react";

const ImageUpload = ({ images, previewUrls, onImageChange, onRemoveImage }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#173A5B] mb-2">
        Images * (Max 5)
      </label>
      <div className="flex flex-wrap gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#3E6380]">
            <Upload size={24} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onImageChange}
              required={images.length === 0}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
