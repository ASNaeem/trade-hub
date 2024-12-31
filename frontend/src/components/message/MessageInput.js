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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || selectedImages.length > 0) {
      // Convert selected images to URLs (assuming they're already uploaded)
      const imageUrls = selectedImages.map((image) => image.url);

      await onSendMessage(message, imageUrls);
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
    <div className="message-input-container">
      {selectedImages.length > 0 && (
        <div className="px-4 py-2 border-t animate-fadeIn">
          <ImagePreview images={selectedImages} onRemove={removeImage} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 p-4 rounded-b-lg bg-white border-t shadow-sm transition-all duration-300 hover:shadow-md"
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
          className="p-2.5 rounded-full text-gray-500 hover:text-[var(--buttonHoverColor)] hover:bg-indigo-50 transition-all duration-200"
        >
          <ImagePlus size={22} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-5 py-3 text-sm rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-400 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="p-3 text-white bg-[var(--buttonColor)] rounded-xl hover:bg-[var(--buttonHoverColor)] transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
