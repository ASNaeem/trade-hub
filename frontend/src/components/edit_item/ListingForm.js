import React, { useState } from "react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import { Textarea, Input, Checkbox } from "@nextui-org/react";
import { conditions } from "../../data/mockdata_itemdetails";
const CATEGORIES = [
  "electronics",
  "clothing",
  "furniture",
  "books",
  "sports",
  "other",
];

const ListingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    condition: "new",
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData({ ...formData, images: newImages });

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-screen min-h-screen p-5 bg-[#F9FAFB] rounded-lg">
      <div className="max-w-4xl mx-auto pl-6 pt-2 rounded-t-md flex justify-between items-center bg-[#244868]">
        <h2 className="text-2xl font-bold text-[#fff] mb-6">
          Fill in the details
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
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

          <FormField label="Condition" required>
            <div className="flex space-x-4">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center">
                  <Checkbox
                    className=""
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
              ))}
            </div>
          </FormField>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3E6380] focus:border-transparent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FormField>

          <FormField label="Price" required>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3E6380] focus:border-transparent"
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
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3E6380] focus:border-transparent"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3E6380]/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3E6380]"></div>
              <span className="ms-3 text-sm font-medium text-[#173A5B]">
                List as visible
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#244868] text-white rounded-md hover:bg-[#173A5B] transition-colors duration-200"
            >
              Create Listing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
