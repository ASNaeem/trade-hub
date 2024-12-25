import React, { useState } from "react";
import { Save, Trash2, Eye, EyeOff } from "lucide-react";
import FormField from "./FormField";
import { categories, conditions } from "../../data/mockdata_itemdetails";
import { Input, SelectItem, Checkbox, Select } from "@nextui-org/react";
import ImageGallery from "./ImageGallery";

export default function ItemEditForm({
  item: initialItem,
  onSave,
  onDelete,
  onCancel,
}) {
  const [item, setItem] = useState(initialItem);
  // const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item);
    setMessage({ type: "success", text: "Changes saved successfully!" });
  };

  const handleRemoveImage = (index) => {
    setItem({
      ...item,
      images: item.images.filter((_, i) => i !== index),
    });
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    alert("Image upload functionality would be implemented here");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <ImageGallery
        images={item.images}
        onRemoveImage={handleRemoveImage}
        onAddImage={handleAddImage}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Title">
          <Input
            radius="sm"
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
          />
        </FormField>

        <FormField label="Price">
          <div className="relative">
            <p role="currency" className="absolute top-0 left-3 text-center">
              ৳
            </p>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-8 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out  placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
            />
          </div>
        </FormField>

        <FormField label="Category">
          <Select
            className="max-w-xs"
            fullWidth
            selectedKeys={[categories.indexOf(item.category).toString()]}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
          >
            {categories.map((category, index) => (
              <SelectItem key={index}>{category}</SelectItem>
            ))}
          </Select>
        </FormField>

        <FormField label="Condition">
          <div className="flex flex-wrap gap-3 md:gap-5">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center">
                <Checkbox
                  className=""
                  isRequired={true && !item.condition}
                  isSelected={item.condition === condition}
                  value={condition}
                  onChange={(e) => {
                    setItem({
                      ...item,
                      condition: e.target.value,
                    });
                  }}
                />
                <span className="capitalize">{condition}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Quantity">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full pl-4 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out  placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
          />
        </FormField>

        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">
            Visibility
          </label>
          <button
            type="button"
            onClick={() => setItem({ ...item, isVisible: !item.isVisible })}
            className={`p-2 rounded-lg ${
              item.isVisible
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      <FormField label="Description">
        <textarea
          rows={4}
          className="w-full px-4 py-2 border text-sm border-none rounded-lg outline-none transition-all duration-200 ease-in-out  placeholder:text-[#71717A] bg-[#F4F4F5] hover:bg-[#FAFAFA]"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />
      </FormField>

      {/* {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )} */}

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Listing
        </button>

        <div className="space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--buttonColor)]  hover:bg-[var(--buttonHoverColor)]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
