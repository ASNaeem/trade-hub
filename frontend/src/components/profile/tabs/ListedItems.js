import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import Modal from "../../edit_item/Modal";
import ItemEditForm from "../../edit_item/ItemEditForm.js";
import userService from "../../../services/userService";

function ListedItems() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUserItems = async () => {
  //     try {
  //       const userStr = localStorage.getItem("user");
  //       if (!userStr) {
  //         setError("User not found in localStorage");
  //         setLoading(false);
  //         return;
  //       }

  //       const user = JSON.parse(userStr);
  //       console.log("User from localStorage:", user);

  //       // Handle both id and _id formats
  //       const userId = user._id || user.id;
  //       if (!userId) {
  //         setError("Invalid user data: missing user ID");
  //         setLoading(false);
  //         return;
  //       }

  //       console.log("Fetching items for user ID:", userId);
  //       const userItems = await userService.getUserItems(userId);
  //       console.log("Fetched items:", userItems);

  //       // Validate image data
  //       userItems.forEach((item, index) => {
  //         console.log(`Item ${index} images:`, item.images);
  //         if (item.images && item.images.length > 0) {
  //           console.log(`First image of item ${index}:`, item.images[0]);
  //         }
  //       });

  //       setItems(userItems);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching user items:", err);
  //       setError(
  //         `Error fetching items: ${err.response?.data?.error || err.message}`
  //       );
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserItems();
  // }, []);

  const handleSave = () => {
    setIsModalOpen(false);
    // Refresh the items list after saving
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        if (userId) {
          userService.getUserItems(userId).then(setItems);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  };

  const getImageSrc = (image) => {
    if (!image) {
      console.log("No image provided");
      return "/placeholder-image.jpg";
    }

    try {
      console.log("Processing image:", image);

      // Handle base64 images
      if (image.type === "base64" && image.data) {
        console.log("Processing base64 image");
        // If the data is already a complete data URL, return it as is
        if (typeof image.data === "string" && image.data.startsWith("data:")) {
          return image.data;
        }
        // Otherwise, construct the data URL
        return `data:${image.contentType || "image/jpeg"};base64,${image.data}`;
      }

      // Handle URL images
      if (image.type === "url" && image.url) {
        console.log("Processing URL image");
        return image.url;
      }

      // Handle legacy format where image might be a direct URL string
      if (typeof image === "string") {
        console.log("Processing string URL image");
        if (image.startsWith("data:")) {
          return image;
        }
        if (image.startsWith("http")) {
          return image;
        }
        // If it's a base64 string without data: prefix
        return `data:image/jpeg;base64,${image}`;
      }

      // Handle buffer type images
      if (image.type === "buffer" && image.data) {
        console.log("Processing buffer image");
        if (typeof image.data === "string") {
          return `data:${image.contentType || "image/jpeg"};base64,${
            image.data
          }`;
        }
        // If data is a Buffer or ArrayBuffer, convert it
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(image.data))
        );
        return `data:${
          image.contentType || "image/jpeg"
        };base64,${base64String}`;
      }

      // If image is an object with just data property (simplified base64)
      if (image.data && typeof image.data === "string") {
        console.log("Processing simplified base64 image");
        if (image.data.startsWith("data:")) {
          return image.data;
        }
        return `data:${image.contentType || "image/jpeg"};base64,${image.data}`;
      }

      console.warn("Unhandled image format:", image);
      return "/placeholder-image.jpg";
    } catch (err) {
      console.error("Error processing image:", err, "Image data:", image);
      return "/placeholder-image.jpg";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Listed Items</h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Listed Items</h2>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Listed Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <React.Fragment key={item._id}>
            <Modal
              isOpen={isModalOpen && item._id === selectedItemId}
              onClose={() => setIsModalOpen(false)}
              title="Edit Item"
            >
              <ItemEditForm
                item={item}
                onSave={handleSave}
                onDelete={() => {
                  setIsModalOpen(false);
                  // Refresh the items list after deleting
                  const userStr = localStorage.getItem("user");
                  if (userStr) {
                    try {
                      const user = JSON.parse(userStr);
                      const userId = user._id || user.id;
                      if (userId) {
                        userService.getUserItems(userId).then(setItems);
                      }
                    } catch (err) {
                      console.error("Error parsing user data:", err);
                    }
                  }
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </Modal>
            <div className="card group">
              <div
                className="relative cursor-pointer aspect-square overflow-hidden rounded-lg bg-gray-100"
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedItemId(item._id);
                }}
              >
                <img
                  src={getImageSrc(item.images[0])}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Image load error:", e);
                    e.target.src = ""; // Clear the source on error
                  }}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm !select-text font-medium text-gray-900">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg !select-text font-semibold text-gray-900">
                    ${item.price}
                  </p>
                </div>
                <div className="flex flex-col justify-between pr-5 mt-1">
                  <p className="text-sm !select-text text-gray-500 mt-1">
                    Condition: {item.condition}
                  </p>
                  <p className="text-sm !select-text text-gray-500 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        <div className="card group select-none">
          <div
            className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[var(--accentColor)] hover:bg-gray-100 transition-colors cursor-pointer aspect-square overflow-hidden"
            onClick={() => {
              window.location.href = "/create_item";
            }}
          >
            <PlusIcon size={30} className="text-gray-400" />
            <span className="text-sm text-gray-500 mt-1">New Listing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListedItems;
