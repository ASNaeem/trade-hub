import React from "react";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SimilarItems({ items }) {
  const navigate = useNavigate();

  // Helper function to get image source
  const getImageSrc = (image) => {
    if (!image) return "";

    // Handle base64 images
    if (image.type === "base64" && image.data) {
      // If the data is already a complete data URL, return it as is
      if (image.data.startsWith("data:")) {
        return image.data;
      }
      // Otherwise, construct the data URL
      return `data:${image.contentType || "image/jpeg"};base64,${image.data}`;
    }

    // Handle URL images
    if (image.type === "url" && image.url) {
      return image.url;
    }

    // Handle legacy format where image might be a direct URL string
    if (typeof image === "string") {
      return image;
    }

    // Handle buffer type images
    if (image.type === "buffer" && image.data) {
      return `data:${image.contentType || "image/jpeg"};base64,${image.data}`;
    }

    return "";
  };

  return (
    <>
      <h2 className="text-2xl font-bold pt-20 text-[var(--textColorPrimary)]">
        Similar Items
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => {
              navigate(`/item?id=${item._id}`);
            }}
          >
            <div className="aspect-square mb-2 overflow-hidden rounded-lg border border-gray-100">
              <img
                src={getImageSrc(item.images[0])}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <h3 className="font-semibold text-[var(--textColorPrimary)] truncate">
              {item.title}
            </h3>
            <p className="text-[var(--buttonColor)] font-bold flex items-center">
              <DollarSign className="h-4 w-4" />
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
