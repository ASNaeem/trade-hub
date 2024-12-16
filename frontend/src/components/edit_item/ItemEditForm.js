import React, { useState } from "react";
import { Save, Trash2, Eye, EyeOff } from "lucide-react";
import { categories, conditions } from "../../data/mockdata_itemdetails";
import ImageGallery from "./ImageGallery";

export default function ItemEditForm({
  item: initialItem,
  onSave,
  onDelete,
  onCancel,
}) {
  const [item, setItem] = useState(initialItem);
  const [message, setMessage] = useState({ type: "", text: "" });

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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                setItem({ ...item, price: parseFloat(e.target.value) })
              }
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={item.category}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            value={item.condition}
            onChange={(e) => setItem({ ...item, condition: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              setItem({ ...item, quantity: parseInt(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1d4e6e]  hover:bg-[#1f4057]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
