import React, { useState, useRef } from "react";
import { ImagePlus, Send } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { useImageUpload } from "./useImageUpload";

export function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const dropZoneRef = useRef(null);
  const {
    selectedImages,
    fileInputRef,
    handleImageSelect,
    removeImage,
    clearImages,
  } = useImageUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || selectedImages.length > 0) {
      onSendMessage(message, selectedImages);
      setMessage("");
      clearImages();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add("bg-indigo-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("bg-indigo-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("bg-indigo-50");
    handleImageSelect(e.dataTransfer.files);
  };

  return (
    <div>
      {selectedImages.length > 0 && (
        <div className="px-4 py-2 border-t">
          <ImagePreview images={selectedImages} onRemove={removeImage} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 bg-white border-t"
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(e) => handleImageSelect(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ImagePlus size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out  placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
        />
        <button
          type="submit"
          className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
