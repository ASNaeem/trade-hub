import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemService from "../../services/ItemService";

const ListingForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setSelectedImages(files.map((file) => URL.createObjectURL(file))); // For preview only
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Get the base64 string without the data URL prefix
        const fullData = reader.result;
        const base64Data = fullData.split(",")[1];

        console.log("Converting image:", {
          type: "base64",
          contentType: file.type,
          hasFullData: !!fullData,
          hasBase64: !!base64Data,
          previewFull: fullData.substring(0, 100) + "...",
          previewBase64: base64Data.substring(0, 100) + "...",
        });

        resolve({
          type: "base64",
          data: base64Data,
          contentType: file.type,
          url: null,
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !title ||
        !description ||
        !price ||
        !category ||
        !condition ||
        !location ||
        !selectedFiles.length
      ) {
        throw new Error(
          "Please fill in all required fields and add at least one image"
        );
      }

      // Convert all images to Base64
      const convertedImages = await Promise.all(
        selectedFiles.map(async (file) => await convertImageToBase64(file))
      );

      console.log(
        "Converted images:",
        convertedImages.map((img) => ({
          type: img.type,
          contentType: img.contentType,
          hasData: !!img.data,
          dataPreview: img.data?.substring(0, 100) + "...",
        }))
      );

      const itemData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        condition,
        location: location.trim(),
        brand: brand ? brand.trim() : null,
        images: convertedImages,
      };

      const response = await ItemService.createItem(itemData);
      console.log("Created item response:", response);

      // Redirect to the item details page
      navigate(`/items/${response._id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      setError(error.message || "Error creating listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... existing form fields ... */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
        // ... other props ...
      />
      {/* ... other form elements ... */}
    </form>
  );
};

export default ListingForm;
