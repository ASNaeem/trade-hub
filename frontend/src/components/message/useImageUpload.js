import { useState, useRef } from "react";

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (files) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  return {
    selectedImages,
    fileInputRef,
    handleImageSelect,
    removeImage,
    clearImages,
  };
}
