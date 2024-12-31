import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ItemService from "../../services/itemService";

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

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);

    // Create temporary URLs for preview
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(previewUrls);
    setSelectedFiles(files);

    // Clean up URLs when component unmounts
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  };

  const convertImageToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fullData = reader.result;
          const base64Data = fullData.split(",")[1];

          console.log("Converting image:", {
            type: "base64",
            contentType: file.type,
            hasFullData: !!fullData,
            hasBase64: !!base64Data,
            previewBase64: base64Data?.substring(0, 50) + "...",
          });

          resolve({
            type: "base64",
            data: base64Data,
            contentType: file.type,
            url: null,
          });
        } catch (error) {
          console.error("Error processing image data:", error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      selectedImages.forEach(URL.revokeObjectURL);
    };
  }, [selectedImages]);

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
        selectedFiles.map(async (file) => {
          const converted = await convertImageToBase64(file);
          console.log("Converted image:", {
            type: converted.type,
            contentType: converted.contentType,
            hasData: !!converted.data,
            dataPreview: converted.data?.substring(0, 50) + "...",
          });
          return converted;
        })
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

      console.log("Submitting item data:", {
        ...itemData,
        images: itemData.images.map((img) => ({
          type: img.type,
          contentType: img.contentType,
          hasData: !!img.data,
        })),
      });

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
