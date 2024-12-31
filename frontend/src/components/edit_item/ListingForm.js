import React, { useState } from "react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import { Select, SelectItem, Input, Checkbox } from "@nextui-org/react";
import { conditions } from "../../data/mockdata_itemdetails";
import { motion } from "framer-motion";
import ItemService from "../../services/itemService";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Furniture",
  "Books",
  "Sports",
  "Other",
];

const ListingForm = ({ className }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    condition: "",
    features: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    isVisible: true,
    images: [],
    location: "",
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const newPreviewUrls = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("expiration", "600");
        formData.append("key", "96ad74aae5c8f60fcc66797aa9bf5820");

        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error.message);
        }

        const data = await response.json();
        return data.data.url;
      })
    );

    const newImages = [...formData.images, ...newPreviewUrls];

    setFormData({ ...formData, images: newImages });

    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.price ||
        !formData.condition ||
        !formData.location ||
        !formData.category
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.images.length === 0) {
        throw new Error("Please add at least one image");
      }

      // Create FormData for image upload
      const apiFormData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        brand: formData.brand,
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        features: formData.features,
        images: formData.images.map((_, index) => ({
          type: "url",
          url: previewUrls[index], // Using preview URLs for now
        })),
      };

      // Create the listing
      const response = await ItemService.createItem(apiFormData);
      navigate(`/item?id=${response._id}`);
    } catch (err) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`w-screen min-h-screen p-5 bg-[#F3F4F6] rounded-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl mx-auto pl-6 pt-2 rounded-t-md flex justify-between items-center bg-[var(--buttonHoverColor)]">
        <h2 className="text-2xl font-bold text-[#fff] mb-6">
          Fill in the details
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <FormField label="Location" required>
            <Input
              placeholder="Enter your location"
              required
              radius="sm"
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
              }}
            />
          </FormField>

          <FormField label="Title" required>
            <Input
              placeholder="Add a short title"
              required
              radius="sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </FormField>

          <div className="flex flex-wrap gap-3 md:gap-7">
            {conditions.map((condition, index) => (
              <motion.div
                key={condition}
                initial={{ x: -20 * (index + 1), opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <label className="flex items-center">
                  <Checkbox
                    className=""
                    isRequired={true && !formData.condition}
                    isSelected={formData.condition === condition}
                    value={condition}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        condition: e.target.value,
                      });
                    }}
                  />
                  <span className="capitalize">{condition}</span>
                </label>
              </motion.div>
            ))}
          </div>

          <FormField label="Features">
            <Input
              placeholder="Optional - separate features with commas"
              radius="sm"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
            />
          </FormField>

          <FormField label="Brand" required>
            <Input
              placeholder="Add a brand name"
              required
              radius="sm"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
          </FormField>

          <FormField label="Description" required>
            <textarea
              required
              rows={4}
              placeholder="Add a description"
              className="w-full px-4 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FormField>

          <FormField label="Price" required>
            <div className="relative">
              <p role="currency" className="absolute top-0 left-3 text-center">
                ৳
              </p>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full pl-8 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </FormField>

          <ImageUpload
            images={formData.images}
            previewUrls={previewUrls}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          <FormField label="Category" required>
            <Select
              className="max-w-xs"
              fullWidth
              isRequired={true}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              label="Select a category"
            >
              {CATEGORIES.map((category, index) => (
                <SelectItem key={index}>{category}</SelectItem>
              ))}
            </Select>
          </FormField>

          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3E6380]/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--buttonHoverColor)]"></div>
              <span className="ms-3 text-sm font-medium text-[#173A5B]">
                List as visible
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[var(--buttonColor)] text-white rounded-md hover:bg-[var(--buttonHoverColor)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ListingForm;
